import { PrismaService } from '../database/prisma.service';
import { GeneratePassDto } from '../../dtos/wallet.dto';
export declare class WalletService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyCards(userId: string): Promise<{
        passes: {
            id: string;
            membershipId: string;
            provider: import("@prisma/client").WalletProvider;
            externalId: string | null;
            status: import("@prisma/client").WalletPassStatus;
            merchant: string;
            points: number;
            visitsCount: number;
            level: string | null;
            levelInfo: {
                name: string;
                color: string | null;
                skinConfig: import("@prisma/client").Prisma.JsonValue;
                benefits: import("@prisma/client").Prisma.JsonValue;
            } | null;
            skinVersion: number;
            createdAt: Date;
        }[];
    }>;
    generatePass(userId: string, dto: GeneratePassDto): Promise<{
        pass: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            membershipId: string;
            provider: import("@prisma/client").WalletProvider;
            externalId: string | null;
            status: import("@prisma/client").WalletPassStatus;
            skinVersion: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        message: string;
    }>;
    getPassById(passId: string): Promise<{
        membership: {
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
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            customerId: string;
            merchantId: string;
            loyaltyProgramId: string | null;
            points: number;
            visitsCount: number;
            status: import("@prisma/client").MembershipStatus;
            level: string | null;
            levelId: string | null;
            joinedAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        membershipId: string;
        provider: import("@prisma/client").WalletProvider;
        externalId: string | null;
        status: import("@prisma/client").WalletPassStatus;
        skinVersion: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    revokePass(passId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        membershipId: string;
        provider: import("@prisma/client").WalletProvider;
        externalId: string | null;
        status: import("@prisma/client").WalletPassStatus;
        skinVersion: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
