import { PosService } from './pos.service';
declare class PosCheckInDto {
    merchantId: string;
    locationId: string;
    customerPhone: string;
}
declare class PosRedeemCouponDto {
    merchantId: string;
    code: string;
}
export declare class PosController {
    private readonly posService;
    constructor(posService: PosService);
    checkIn(dto: PosCheckInDto): Promise<{
        visit: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            membershipId: string;
            merchantId: string;
            locationId: string | null;
            customerId: string;
            source: import("@prisma/client").VisitSource;
            qrCodeId: string | null;
            createdAt: Date;
        }, unknown> & {};
        membership: import("@prisma/client/runtime/library").GetResult<{
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
    }>;
    redeemCoupon(dto: PosRedeemCouponDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    redeemReward(merchantId: string, customerId: string, rewardId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        rewardId: string;
        membershipId: string;
        customerId: string;
        merchantId: string;
        redeemedAt: Date | null;
        status: import("@prisma/client").RedemptionStatus;
    }, unknown> & {}>;
    lookupCustomer(merchantId: string, query: string): Promise<{
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        membership: import("@prisma/client/runtime/library").GetResult<{
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
    }[]>;
}
export {};
