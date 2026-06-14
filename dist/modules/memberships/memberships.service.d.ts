import { PrismaService } from '../database/prisma.service';
export declare class MembershipsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findCustomerProfile(userId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        displayName: string | null;
        birthday: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}) | null>;
    getCustomerMemberships(customerId: string): Promise<({
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
        loyaltyProgram: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            type: import("@prisma/client").LoyaltyProgramType;
            description: string | null;
            pointsPerVisit: number;
            visitsRequiredForReward: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
        levelInfo: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            minPoints: number;
            minVisits: number;
            color: string | null;
            badgeUrl: string | null;
            isSystem: boolean;
            skinType: string;
            skinConfig: import("@prisma/client").Prisma.JsonValue | null;
            benefits: import("@prisma/client").Prisma.JsonValue | null;
            sortOrder: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
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
    }, unknown> & {})[]>;
    getMembershipById(id: string): Promise<({
        customer: {
            user: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                email: string | null;
                phone: string | null;
                passwordHash: string | null;
                name: string | null;
                role: import("@prisma/client").UserRole;
                emailVerified: boolean;
                emailVerificationToken: string | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            userId: string;
            displayName: string | null;
            birthday: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
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
        loyaltyProgram: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            type: import("@prisma/client").LoyaltyProgramType;
            description: string | null;
            pointsPerVisit: number;
            visitsRequiredForReward: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
        levelInfo: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            minPoints: number;
            minVisits: number;
            color: string | null;
            badgeUrl: string | null;
            isSystem: boolean;
            skinType: string;
            skinConfig: import("@prisma/client").Prisma.JsonValue | null;
            benefits: import("@prisma/client").Prisma.JsonValue | null;
            sortOrder: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
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
    }, unknown> & {}) | null>;
    createMembership(customerId: string, merchantId: string, loyaltyProgramId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    updateMembershipPoints(membershipId: string, points: number): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    updateMembershipVisits(membershipId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
}
