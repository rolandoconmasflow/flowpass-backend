import { PrismaService } from '../database/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';
export declare class AchievementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAchievementDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        criteria: import("@prisma/client").Prisma.JsonValue | null;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findByMerchant(merchantId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        criteria: import("@prisma/client").Prisma.JsonValue | null;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    findById(id: string): Promise<{
        earnedBy: ({
            customer: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                userId: string;
                displayName: string | null;
                birthday: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            customerId: string;
            achievementId: string;
            earnedAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        criteria: import("@prisma/client").Prisma.JsonValue | null;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    update(id: string, data: UpdateAchievementDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        criteria: import("@prisma/client").Prisma.JsonValue | null;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    delete(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        description: string | null;
        iconUrl: string | null;
        criteria: import("@prisma/client").Prisma.JsonValue | null;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    awardAchievement(customerId: string, achievementId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        customerId: string;
        achievementId: string;
        earnedAt: Date;
    }, unknown> & {}>;
    getCustomerAchievements(customerId: string): Promise<({
        achievement: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            description: string | null;
            iconUrl: string | null;
            criteria: import("@prisma/client").Prisma.JsonValue | null;
            points: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        customerId: string;
        achievementId: string;
        earnedAt: Date;
    }, unknown> & {})[]>;
    evaluateAndAward(customerId: string, merchantId: string): Promise<string[]>;
}
