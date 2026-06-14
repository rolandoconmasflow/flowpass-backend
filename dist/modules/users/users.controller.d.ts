import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from '../../dtos/user.dto';
declare class UpdateRoleDto {
    role: UserRole;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string | null;
        name: string | null;
        role: UserRole;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(userData: CreateUserDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    updateRole(id: string, dto: UpdateRoleDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    getProfile(req: any): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string | null;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string | null;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
export {};
