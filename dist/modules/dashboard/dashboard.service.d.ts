import { PrismaService } from '../database/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getMerchantDashboard(merchantId: string): Promise<{
        overview: {
            activeMemberships: number;
            totalVisits: number;
            recentVisits: number;
            totalCoupons: number;
            redeemedCoupons: number;
            redemptionRate: number;
            totalPointsIssued: number;
            newMemberships: number;
        };
        topCustomers: {
            name: string;
            email: string | null;
            points: number;
            visits: number;
            level: string | null;
        }[];
    }>;
    getAdminDashboard(): Promise<{
        stats: {
            merchants: number;
            customers: number;
            visits: number;
            coupons: number;
            activeMemberships: number;
        };
        recentMerchants: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
        }[];
    }>;
}
