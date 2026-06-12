import { DiscountType, RedemptionMode } from '@prisma/client';
export declare class CreatePromotionDto {
    merchantId: string;
    locationId?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    discountType?: DiscountType;
    discountValue?: number;
    maxClaims?: number;
    maxClaimsPerCustomer?: number;
    redemptionMode?: RedemptionMode;
    claimStartsAt?: string;
    claimEndsAt?: string;
    validFrom?: string;
    validTo?: string;
    termsAndConditions?: string;
    isActive?: boolean;
}
export declare class UpdatePromotionDto {
    locationId?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    discountType?: DiscountType;
    discountValue?: number;
    maxClaims?: number;
    maxClaimsPerCustomer?: number;
    redemptionMode?: RedemptionMode;
    claimStartsAt?: string;
    claimEndsAt?: string;
    validFrom?: string;
    validTo?: string;
    termsAndConditions?: string;
    isActive?: boolean;
}
