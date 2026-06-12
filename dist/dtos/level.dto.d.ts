export declare class CreateLevelDto {
    merchantId: string;
    name: string;
    minPoints?: number;
    minVisits?: number;
    color?: string;
    badgeUrl?: string;
    isSystem?: boolean;
    skinType?: string;
    skinConfig?: Record<string, unknown>;
    benefits?: Record<string, unknown>;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class UpdateLevelDto {
    name?: string;
    minPoints?: number;
    minVisits?: number;
    color?: string;
    badgeUrl?: string;
    isSystem?: boolean;
    skinType?: string;
    skinConfig?: Record<string, unknown>;
    benefits?: Record<string, unknown>;
    sortOrder?: number;
    isActive?: boolean;
}
