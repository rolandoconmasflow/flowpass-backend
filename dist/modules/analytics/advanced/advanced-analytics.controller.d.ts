import { AdvancedAnalyticsService } from './advanced-analytics.service';
export declare class AdvancedAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AdvancedAnalyticsService);
    retention(merchantId: string): Promise<{
        period: string;
        totalCustomers: number;
        retained: number;
        retentionRate: number;
    }>;
    cohorts(merchantId: string): Promise<{
        month: string;
        total: number;
        retained: number;
        retentionRate: number;
    }[]>;
    economics(merchantId: string): Promise<{
        totalVisits: number;
        totalRedemptions: number;
        totalPointsInCirculation: number;
        avgPointsPerCustomer: number;
    }>;
    dashboard(merchantId: string): Promise<{
        activeMemberships: number;
        recentVisits: number;
        retention: {
            period: string;
            totalCustomers: number;
            retained: number;
            retentionRate: number;
        };
        economics: {
            totalVisits: number;
            totalRedemptions: number;
            totalPointsInCirculation: number;
            avgPointsPerCustomer: number;
        };
    }>;
}
