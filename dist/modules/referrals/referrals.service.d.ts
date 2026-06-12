import { PrismaService } from '../database/prisma.service';
export declare class ReferralsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateCode(customerId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        customerId: string;
        code: string;
        usedCount: number;
        createdAt: Date;
    }, unknown> & {}>;
    getCode(customerId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        customerId: string;
        code: string;
        usedCount: number;
        createdAt: Date;
    }, unknown> & {}) | null>;
    processReferral(code: string, referredId: string, merchantId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        referralCodeId: string;
        referredId: string;
        merchantId: string;
        rewardGiven: boolean;
        rewardPoints: number;
        createdAt: Date;
    }, unknown> & {}>;
    getReferralStats(customerId: string, merchantId: string): Promise<{
        totalReferrals: number;
        totalPointsEarned: number;
        referrals: ({
            referred: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                userId: string;
                displayName: string | null;
                birthday: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            referralCodeId: string;
            referredId: string;
            merchantId: string;
            rewardGiven: boolean;
            rewardPoints: number;
            createdAt: Date;
        }, unknown> & {})[];
    }>;
}
