import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
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

    const user = await this.usersService.create({
      ...userData,
      name: userData.name || userData.email,
    });
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

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'Si el email existe, recibirás un link de recuperación.' };

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    // En producción acá se enviaría el email con nodemailer
    // Por ahora devolvemos el token en la respuesta para testing
    return { message: 'Si el email existe, recibirás un link de recuperación.', token };
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
