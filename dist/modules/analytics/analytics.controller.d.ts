import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(req: any): Promise<{
        message: string;
        totalMerchants?: undefined;
        totalMemberships?: undefined;
        totalVisits?: undefined;
        totalPromotions?: undefined;
        totalCoupons?: undefined;
        activeCoupons?: undefined;
        recentVisits?: undefined;
        role?: undefined;
    } | {
        totalMerchants: number;
        totalMemberships: number;
        totalVisits: number;
        totalPromotions: number;
        totalCoupons: number;
        activeCoupons: number;
        recentVisits: never[] | ({
            customer: {
                displayName: string | null;
            };
            merchant: {
                name: string;
            };
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            membershipId: string;
            merchantId: string;
            locationId: string | null;
            customerId: string;
            source: import("@prisma/client").VisitSource;
            qrCodeId: string | null;
            createdAt: Date;
        }, unknown> & {})[];
        role: import("@prisma/client").UserRole;
        message?: undefined;
    }>;
}
