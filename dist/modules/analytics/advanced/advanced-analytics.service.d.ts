import { PrismaService } from '../../database/prisma.service';
export declare class AdvancedAnalyticsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getRetentionRate(merchantId: string, days?: number): Promise<{
        period: string;
        totalCustomers: number;
        retained: number;
        retentionRate: number;
    }>;
    getCohortAnalysis(merchantId: string): Promise<{
        month: string;
        total: number;
        retained: number;
        retentionRate: number;
    }[]>;
    getPointsEconomics(merchantId: string): Promise<{
        totalVisits: number;
        totalRedemptions: number;
        totalPointsInCirculation: number;
        avgPointsPerCustomer: number;
    }>;
    getDashboard(merchantId: string): Promise<{
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
