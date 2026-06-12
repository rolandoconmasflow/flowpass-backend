import { CrmService } from './crm.service';
export declare class CrmController {
    private readonly crmService;
    constructor(crmService: CrmService);
    getCustomers(merchantId: string, minPoints?: string, maxPoints?: string, minVisits?: string, level?: string, status?: string, joinedAfter?: string, joinedBefore?: string): Promise<({
        customer: {
            user: {
                name: string | null;
                email: string | null;
                phone: string | null;
            };
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            userId: string;
            displayName: string | null;
            birthday: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        _count: {
            visits: number;
            coupons: number;
        };
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
    getSegments(merchantId: string): Promise<{
        total: number;
        byLevel: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.MembershipGroupByOutputType, "level"[]> & {
            _count: number;
        })[];
        byStatus: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.MembershipGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
        segments: {
            highValue: number;
            atRisk: number;
            active: number;
        };
    }>;
    getTimeline(customerId: string, merchantId: string): Promise<{
        visits: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            membershipId: string;
            merchantId: string;
            locationId: string | null;
            customerId: string;
            source: import("@prisma/client").VisitSource;
            qrCodeId: string | null;
            createdAt: Date;
        }, unknown> & {})[];
        redemptions: ({
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
        }, unknown> & {})[];
        coupons: ({
            promotion: import("@prisma/client/runtime/library").GetResult<{
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
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
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
        }, unknown> & {})[];
    }>;
}
