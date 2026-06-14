import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

type RegisterInput = {
  email: string;
  password: string;
  name?: string;
  role?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private signToken(
    user: { id: string; email: string | null; role: string },
    activeMerchantId?: string | null,
  ) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      activeMerchantId: activeMerchantId ?? null,
    };

    return this.jwtService.sign(payload);
  }

  async registerUser(userData: RegisterInput) {
    const existingUser = await this.usersService.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await this.usersService.create({
      ...userData,
      name: userData.name || userData.email,
      emailVerificationToken: verificationToken,
    });

    this.mailService.sendVerificationEmail(user.email!, verificationToken);

    const sanitizedUser = this.usersService.sanitizeUser(user);

    return {
      user: sanitizedUser,
      access_token: this.signToken(user),
    };
  }

  async updateProfile(userId: string, data: { name?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });
    return this.usersService.sanitizeUser(user);
  }

  async login(loginData: LoginInput) {
    const user = await this.usersService.findByEmail(loginData.email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Si es MERCHANT_OWNER, buscar el primer merchant como activo
    let activeMerchantId: string | null = null;
    if (user.role === 'MERCHANT_OWNER') {
      const firstMerchant = await this.prisma.merchant.findFirst({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'asc' },
      });
      activeMerchantId = firstMerchant?.id ?? null;
    }

    return {
      user: this.usersService.sanitizeUser(user),
      access_token: this.signToken(user, activeMerchantId),
      activeMerchantId,
    };
  }

  async me(token: string) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.usersService.sanitizeUser(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async signTokenWithMerchant(userId: string, activeMerchantId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.signToken({ id: user.id, email: user.email, role: user.role }, activeMerchantId);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Token de verificación inválido');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerificationToken: null },
    });

    return { message: 'Correo verificado exitosamente.' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'Si el email existe, recibirás un link de verificación.' };
    }
    if (user.emailVerified) {
      return { message: 'El correo ya está verificado.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: token },
    });

    this.mailService.sendVerificationEmail(email, token);
    return { message: 'Si el email existe, recibirás un link de verificación.' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'Si el email existe, recibirás un link de recuperación.' };

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    this.mailService.sendResetPasswordEmail(email, token);

    return { message: 'Si el email existe, recibirás un link de recuperación.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash: hash },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    return { message: 'Contraseña actualizada exitosamente.' };
  }
}
