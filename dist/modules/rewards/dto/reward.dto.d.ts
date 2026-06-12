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
