import { MissionType, MissionRepeat } from '@prisma/client';
export declare class CreateMissionDto {
    merchantId: string;
    title: string;
    description?: string;
    type?: MissionType;
    repeat?: MissionRepeat;
    goalValue?: number;
    rewardPoints?: number;
    rewardCouponId?: string;
    startsAt?: string;
    endsAt?: string;
    isActive?: boolean;
}
export declare class UpdateMissionDto {
    title?: string;
    description?: string;
    type?: MissionType;
    repeat?: MissionRepeat;
    goalValue?: number;
    rewardPoints?: number;
    rewardCouponId?: string;
    startsAt?: string;
    endsAt?: string;
    isActive?: boolean;
}
