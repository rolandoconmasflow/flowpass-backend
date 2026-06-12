import { UploadFile } from '../uploads/uploads.service';
import { UserRole } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { MerchantsService } from './merchants.service';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { CreateMerchantDto, UpdateMerchantDto, RegisterMerchantDto } from '../../dtos/merchant.dto';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';
export declare class MerchantsController {
    private readonly merchantsService;
    private readonly authService;
    constructor(merchantsService: MerchantsService, authService: AuthService);
    register(dto: RegisterMerchantDto): Promise<{
        merchant: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            levelsEnabled: boolean;
            commissionRate: number | null;
            stripeAccountId: string | null;
            ownerId: string;
            category: import("@prisma/client").MerchantCategory;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        user: {
            id: string;
            email: string | null;
            name: string | null;
            role: UserRole;
        };
        access_token: string;
        activeMerchantId: string;
    }>;
    findPublic(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").MerchantCategory;
        locations: {
            id: string;
            name: string;
            address: string | null;
            city: string | null;
        }[];
    }[]>;
    findAll(query: PaginatedQueryDto): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[] | import("../../dtos/paginated.dto").PaginatedResult<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>>;
    getCategories(): Promise<string[]>;
    getMyMerchant(req: RequestWithUser): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getMyMerchants(req: RequestWithUser): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    switchMerchant(req: RequestWithUser, id: string): Promise<{
        merchant: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            levelsEnabled: boolean;
            commissionRate: number | null;
            stripeAccountId: string | null;
            ownerId: string;
            category: import("@prisma/client").MerchantCategory;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        access_token: Promise<string>;
        activeMerchantId: string;
    }>;
    findOne(id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}) | null>;
    create(createMerchantDto: CreateMerchantDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    update(req: RequestWithUser, id: string, updateMerchantDto: UpdateMerchantDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    uploadLogo(req: RequestWithUser, id: string, file: UploadFile): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logoUrl: string | null;
        levelsEnabled: boolean;
        commissionRate: number | null;
        stripeAccountId: string | null;
        ownerId: string;
        category: import("@prisma/client").MerchantCategory;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getLogo(id: string): Promise<{
        logoUrl: string | null;
    }>;
}
