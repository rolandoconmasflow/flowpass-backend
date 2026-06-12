import { UploadFile } from '../uploads/uploads.service';
import { MenuService } from './menu.service';
import { CreateMenuCategoryDto, UpdateMenuCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, BulkImportItemDto } from './dto/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getFullMenu(merchantId: string, lang?: string): Promise<({
        items: ({
            translations: (import("@prisma/client/runtime/library").GetResult<{
                id: string;
                menuItemId: string;
                language: string;
                name: string;
                description: string | null;
            }, unknown> & {})[];
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            categoryId: string;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            imageUrl: string | null;
            imageEnhancedUrl: string | null;
            isAvailable: boolean;
            sortOrder: number;
            isBestseller: boolean;
            dietaryTags: import("@prisma/client").DietaryTag[];
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getBestsellers(merchantId: string): Promise<({
        items: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            categoryId: string;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            imageUrl: string | null;
            imageEnhancedUrl: string | null;
            isAvailable: boolean;
            sortOrder: number;
            isBestseller: boolean;
            dietaryTags: import("@prisma/client").DietaryTag[];
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    createCategory(dto: CreateMenuCategoryDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    updateCategory(id: string, dto: UpdateMenuCategoryDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    deleteCategory(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        name: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    createItem(dto: CreateMenuItemDto): Promise<{
        category: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            sortOrder: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        imageUrl: string | null;
        imageEnhancedUrl: string | null;
        isAvailable: boolean;
        sortOrder: number;
        isBestseller: boolean;
        dietaryTags: import("@prisma/client").DietaryTag[];
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    updateItem(id: string, dto: UpdateMenuItemDto): Promise<{
        category: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            sortOrder: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        imageUrl: string | null;
        imageEnhancedUrl: string | null;
        isAvailable: boolean;
        sortOrder: number;
        isBestseller: boolean;
        dietaryTags: import("@prisma/client").DietaryTag[];
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    deleteItem(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        imageUrl: string | null;
        imageEnhancedUrl: string | null;
        isAvailable: boolean;
        sortOrder: number;
        isBestseller: boolean;
        dietaryTags: import("@prisma/client").DietaryTag[];
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    uploadItemImage(id: string, file: UploadFile): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        imageUrl: string | null;
        imageEnhancedUrl: string | null;
        isAvailable: boolean;
        sortOrder: number;
        isBestseller: boolean;
        dietaryTags: import("@prisma/client").DietaryTag[];
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    bulkImport(dto: {
        merchantId: string;
        items: BulkImportItemDto[];
    }): Promise<{
        imported: number;
        items: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            categoryId: string;
            name: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            imageUrl: string | null;
            imageEnhancedUrl: string | null;
            isAvailable: boolean;
            sortOrder: number;
            isBestseller: boolean;
            dietaryTags: import("@prisma/client").DietaryTag[];
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
    }>;
}
