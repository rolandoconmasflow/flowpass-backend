import { RewardsService } from './rewards.service';
import { CreateRewardDto, UpdateRewardDto } from './dto/reward.dto';
export declare class RewardsController {
    private readonly rewardsService;
    constructor(rewardsService: RewardsService);
    create(dto: CreateRewardDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    findByMerchant(merchantId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    catalog(customerId: string): Promise<{
        canRedeem: boolean;
        userPoints: number;
        userVisits: number;
        merchant: {
            name: string;
            logoUrl: string | null;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        merchantId: string;
        isActive: boolean;
        loyaltyProgramId: string | null;
        title: string;
        requiredPoints: number | null;
        requiredVisits: number | null;
        validFrom: Date | null;
        validTo: Date | null;
    }[]>;
    findById(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    update(id: string, dto: UpdateRewardDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    delete(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    redeem(id: string, customerId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        rewardId: string;
        membershipId: string;
        customerId: string;
        merchantId: string;
        redeemedAt: Date | null;
        status: import("@prisma/client").RedemptionStatus;
    }, unknown> & {}>;
    history(membershipId: string): Promise<({
        reward: import("@prisma/client/runtime/library").GetResult<{
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
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        rewardId: string;
        membershipId: string;
        customerId: string;
        merchantId: string;
        redeemedAt: Date | null;
        status: import("@prisma/client").RedemptionStatus;
    }, unknown> & {})[]>;
}
