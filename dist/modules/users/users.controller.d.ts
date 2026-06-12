import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from '../../dtos/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(userData: CreateUserDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        name: string | null;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string | null;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getProfile(req: any): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string | null;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
