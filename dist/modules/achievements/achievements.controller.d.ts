import { AchievementsService } from './achievements.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    create(dto: CreateAchievementDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    update(id: string, dto: UpdateAchievementDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    award(id: string, customerId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
}
