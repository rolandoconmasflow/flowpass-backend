import { PrismaService } from '../database/prisma.service';
import { UserRole } from '@prisma/client';
export declare class StaffService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    addStaffByEmail(merchantId: string, email: string, role?: UserRole): Promise<{
        user: {
            id: string;
            name: string | null;
            email: string | null;
            role: UserRole;
        };
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        userId: string;
        role: UserRole;
        createdAt: Date;
    }, unknown> & {}>;
    addStaff(merchantId: string, userId: string, role?: UserRole): Promise<{
        user: {
            id: string;
            name: string | null;
            email: string | null;
            role: UserRole;
        };
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        userId: string;
        role: UserRole;
        createdAt: Date;
    }, unknown> & {}>;
    listStaff(merchantId: string): Promise<{
        staff: ({
            user: {
                id: string;
                name: string | null;
                email: string | null;
                role: UserRole;
            };
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            userId: string;
            role: UserRole;
            createdAt: Date;
        }, unknown> & {})[];
        count: number;
        limit: number;
    }>;
    removeStaff(merchantId: string, userId: string): Promise<{
        success: boolean;
    }>;
    updateStaffRole(merchantId: string, userId: string, role: UserRole): Promise<{
        user: {
            id: string;
            name: string | null;
            email: string | null;
            role: UserRole;
        };
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        userId: string;
        role: UserRole;
        createdAt: Date;
    }, unknown> & {}>;
}
