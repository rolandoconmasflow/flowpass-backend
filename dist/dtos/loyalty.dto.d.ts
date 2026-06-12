import { LoyaltyProgramType } from '@prisma/client';
export declare class CreateLoyaltyProgramDto {
    merchantId: string;
    name: string;
    type: LoyaltyProgramType;
    description?: string;
    pointsPerVisit?: number;
    visitsRequiredForReward?: number;
    isActive?: boolean;
}
export declare class UpdateLoyaltyProgramDto {
    name?: string;
    type?: LoyaltyProgramType;
    description?: string;
    pointsPerVisit?: number;
    visitsRequiredForReward?: number;
    isActive?: boolean;
}
export declare class CreateRewardDto {
    merchantId: string;
    loyaltyProgramId?: string;
    title: string;
    description?: string;
    requiredPoints?: number;
    requiredVisits?: number;
    validFrom?: string;
    validTo?: string;
    isActive?: boolean;
}
export declare class UpdateRewardDto {
    title?: string;
    description?: string;
    requiredPoints?: number;
    requiredVisits?: number;
    validFrom?: string;
    validTo?: string;
    isActive?: boolean;
}
