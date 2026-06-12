export declare class CreateAchievementDto {
    merchantId: string;
    name: string;
    description?: string;
    iconUrl?: string;
    criteria?: Record<string, unknown>;
    points?: number;
}
export declare class UpdateAchievementDto {
    name?: string;
    description?: string;
    iconUrl?: string;
    criteria?: Record<string, unknown>;
    points?: number;
}
