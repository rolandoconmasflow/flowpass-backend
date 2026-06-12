import { LoyaltyService } from './loyalty.service';
import { CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, CreateRewardDto, UpdateRewardDto } from '../../dtos/loyalty.dto';
export declare class LoyaltyController {
    private readonly loyaltyService;
    constructor(loyaltyService: LoyaltyService);
    createProgram(dto: CreateLoyaltyProgramDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    getAllPrograms(): Promise<({
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
        rewards: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            loyaltyProgramId: string | null;
            title: string;
            description: string | null;
            requiredPoints: number | null;
            requiredVisits: number | null;
            validFrom: Date | null;
            validTo: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {})[]>;
    getProgramsByMerchant(merchantId: string): Promise<({
        rewards: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            loyaltyProgramId: string | null;
            title: string;
            description: string | null;
            requiredPoints: number | null;
            requiredVisits: number | null;
            validFrom: Date | null;
            validTo: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {})[]>;
    getProgramById(id: string): Promise<{
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
        rewards: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            loyaltyProgramId: string | null;
            title: string;
            description: string | null;
            requiredPoints: number | null;
            requiredVisits: number | null;
            validFrom: Date | null;
            validTo: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        memberships: (import("@prisma/client/runtime/library").GetResult<{
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
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    updateProgram(id: string, dto: UpdateLoyaltyProgramDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    deleteProgram(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    createReward(dto: CreateRewardDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        loyaltyProgramId: string | null;
        title: string;
        description: string | null;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getAllRewards(): Promise<({
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
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        loyaltyProgramId: string | null;
        title: string;
        description: string | null;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getRewardsByMerchant(merchantId: string): Promise<({
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
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        loyaltyProgramId: string | null;
        title: string;
        description: string | null;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getRewardById(id: string): Promise<{
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
        redemptions: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            rewardId: string;
            membershipId: string;
            customerId: string;
            merchantId: string;
            redeemedAt: Date | null;
            status: import("@prisma/client").RedemptionStatus;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        loyaltyProgramId: string | null;
        title: string;
        description: string | null;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    updateReward(id: string, dto: UpdateRewardDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        loyaltyProgramId: string | null;
        title: string;
        description: string | null;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    deleteReward(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        loyaltyProgramId: string | null;
        title: string;
        description: string | null;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
