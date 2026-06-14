import { PrismaService } from '../database/prisma.service';
import { User, UserRole, Prisma } from '@prisma/client';
import { CreateUserDto } from '../../dtos/user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        role: UserRole;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string | null;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: CreateUserDto & {
        emailVerificationToken?: string;
    }): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        name: string | null;
        role: UserRole;
        emailVerified: boolean;
        emailVerificationToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        name: string | null;
        role: UserRole;
        emailVerified: boolean;
        emailVerificationToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    sanitizeUser(user: Record<string, unknown>): {
        [x: string]: unknown;
    };
}
