import { UserRole } from '@prisma/client';
import { StaffService } from './staff.service';
declare class AddStaffDto {
    merchantId: string;
    userId: string;
    role: UserRole;
}
declare class UpdateStaffRoleDto {
    role: UserRole;
}
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    addStaff(dto: AddStaffDto): Promise<{
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
    listStaff(merchantId: string): Promise<({
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
    }, unknown> & {})[]>;
    removeStaff(merchantId: string, userId: string): Promise<{
        success: boolean;
    }>;
    updateRole(merchantId: string, userId: string, dto: UpdateStaffRoleDto): Promise<{
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
export {};
