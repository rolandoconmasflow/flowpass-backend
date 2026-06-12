import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { UploadsService, UploadFile } from '../uploads/uploads.service';
import { CreateMerchantDto, UpdateMerchantDto, RegisterMerchantDto } from '../../dtos/merchant.dto';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';
export declare class MerchantsService {
    private readonly prisma;
    private readonly jwtService;
    private readonly uploadsService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, uploadsService: UploadsService);
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
    findAll(query?: PaginatedQueryDto): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {})[] | PaginatedResult<import("@prisma/client/runtime/library").GetResult<{
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
    create(data: CreateMerchantDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    update(id: string, data: UpdateMerchantDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    findByOwnerId(ownerId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    findAllByOwnerId(ownerId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    switchActiveMerchant(userId: string, merchantId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    updateLogo(id: string, file: UploadFile): Promise<import("@prisma/client/runtime/library").GetResult<{
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
            role: import("@prisma/client").UserRole;
        };
        access_token: string;
        activeMerchantId: string;
    }>;
}
