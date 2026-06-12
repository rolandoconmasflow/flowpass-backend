import { DietaryTag } from '@prisma/client';
export declare class CreateMenuCategoryDto {
    merchantId: string;
    name: string;
    sortOrder?: number;
}
export declare class UpdateMenuCategoryDto {
    name?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class CreateMenuItemDto {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    imageUrl?: string;
    isAvailable?: boolean;
    sortOrder?: number;
    isBestseller?: boolean;
    dietaryTags?: DietaryTag[];
}
export declare class UpdateMenuItemDto {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    imageUrl?: string;
    isAvailable?: boolean;
    sortOrder?: number;
    isBestseller?: boolean;
    dietaryTags?: DietaryTag[];
}
export declare class BulkImportItemDto {
    categoryName: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    isAvailable?: boolean;
    sortOrder?: number;
    isBestseller?: boolean;
    dietaryTags?: DietaryTag[];
}
