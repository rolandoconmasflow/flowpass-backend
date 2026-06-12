import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Solo se puede crear como CUSTOMER desde el registro público.
    // Roles superiores (MERCHANT_OWNER, MERCHANT_STAFF) solo los asigna un SUPER_ADMIN.
    const role = 'CUSTOMER';

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: role as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await this.prisma.customerProfile.create({
      data: {
        userId: user.id,
        displayName: data.name || data.email,
      },
    });

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  sanitizeUser(user: Record<string, unknown>) {
    const { passwordHash: _pw, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
