import { PrismaService } from '../database/prisma.service';
import { CreateMissionDto, UpdateMissionDto } from './dto/mission.dto';
export declare class MissionsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: CreateMissionDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        type: import("@prisma/client").MissionType;
        repeat: import("@prisma/client").MissionRepeat;
        goalValue: number;
        rewardPoints: number;
        rewardCouponId: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findByMerchant(merchantId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        type: import("@prisma/client").MissionType;
        repeat: import("@prisma/client").MissionRepeat;
        goalValue: number;
        rewardPoints: number;
        rewardCouponId: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    findById(id: string): Promise<{
        customerMissions: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            customerId: string;
            missionId: string;
            progress: number;
            completed: boolean;
            completedAt: Date | null;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        type: import("@prisma/client").MissionType;
        repeat: import("@prisma/client").MissionRepeat;
        goalValue: number;
        rewardPoints: number;
        rewardCouponId: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    update(id: string, data: UpdateMissionDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        type: import("@prisma/client").MissionType;
        repeat: import("@prisma/client").MissionRepeat;
        goalValue: number;
        rewardPoints: number;
        rewardCouponId: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    delete(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        type: import("@prisma/client").MissionType;
        repeat: import("@prisma/client").MissionRepeat;
        goalValue: number;
        rewardPoints: number;
        rewardCouponId: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getCustomerMissions(customerId: string): Promise<({
        mission: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            title: string;
            description: string | null;
            type: import("@prisma/client").MissionType;
            repeat: import("@prisma/client").MissionRepeat;
            goalValue: number;
            rewardPoints: number;
            rewardCouponId: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        customerId: string;
        missionId: string;
        progress: number;
        completed: boolean;
        completedAt: Date | null;
    }, unknown> & {})[]>;
    trackProgress(customerId: string, missionId: string, increment?: number): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        customerId: string;
        missionId: string;
        progress: number;
        completed: boolean;
        completedAt: Date | null;
    }, unknown> & {}>;
    getActiveMissionsForCustomer(customerId: string): Promise<{
        customerProgress: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            customerId: string;
            missionId: string;
            progress: number;
            completed: boolean;
            completedAt: Date | null;
        }, unknown> & {};
        customerMissions: undefined;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        merchantId: string;
        title: string;
        type: import("@prisma/client").MissionType;
        isActive: boolean;
        rewardPoints: number;
        repeat: import("@prisma/client").MissionRepeat;
        goalValue: number;
        rewardCouponId: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
    }[]>;
}
