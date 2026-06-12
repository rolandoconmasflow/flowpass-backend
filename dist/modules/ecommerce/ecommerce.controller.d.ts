import { EcommerceService } from './ecommerce.service';
export declare class EcommerceController {
    private readonly ecommerceService;
    constructor(ecommerceService: EcommerceService);
    getMerchant(slug: string): Promise<{
        locations: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            openingHours: import("@prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        loyaltyPrograms: (import("@prisma/client/runtime/library").GetResult<{
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
        }, unknown> & {})[];
        promotions: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            locationId: string | null;
            loyaltyProgramId: string | null;
            title: string;
            description: string | null;
            imageUrl: string | null;
            priceText: string | null;
            discountType: import("@prisma/client").DiscountType;
            discountValue: number | null;
            maxClaims: number | null;
            maxClaimsPerCustomer: number | null;
            redemptionMode: import("@prisma/client").RedemptionMode;
            claimStartsAt: Date | null;
            claimEndsAt: Date | null;
            validFrom: Date | null;
            validTo: Date | null;
            termsAndConditions: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
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
    getRewards(slug: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    claimPromotion(slug: string, promotionId: string, customerId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        promotionId: string;
        customerId: string;
        merchantId: string;
        locationId: string | null;
        membershipId: string | null;
        code: string;
        qrCodeValue: string | null;
        status: import("@prisma/client").CouponStatus;
        claimedAt: Date;
        expiresAt: Date | null;
        redeemedAt: Date | null;
        redemptionChannel: import("@prisma/client").RedemptionChannel | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
