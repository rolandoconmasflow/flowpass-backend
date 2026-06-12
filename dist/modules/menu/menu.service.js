"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MenuService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
let MenuService = MenuService_1 = class MenuService {
    prisma;
    uploadsService;
    logger = new common_1.Logger(MenuService_1.name);
    constructor(prisma, uploadsService) {
        this.prisma = prisma;
        this.uploadsService = uploadsService;
    }
    async getFullMenu(merchantId, lang) {
        const categories = await this.prisma.menuCategory.findMany({
            where: { merchantId, isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
                items: {
                    where: { isAvailable: true },
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        translations: lang ? { where: { language: lang } } : false,
                    },
                },
            },
        });
        return categories;
    }
    async createCategory(dto) {
        return this.prisma.menuCategory.create({
            data: {
                merchantId: dto.merchantId,
                name: dto.name,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateCategory(id, dto) {
        const cat = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.menuCategory.update({ where: { id }, data: dto });
    }
    async deleteCategory(id) {
        const cat = await this.prisma.menuCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.menuCategory.delete({ where: { id } });
    }
    async createItem(dto) {
        return this.prisma.menuItem.create({
            data: {
                categoryId: dto.categoryId,
                name: dto.name,
                description: dto.description,
                price: dto.price,
                currency: dto.currency ?? 'ARS',
                imageUrl: dto.imageUrl,
                isAvailable: dto.isAvailable ?? true,
                sortOrder: dto.sortOrder ?? 0,
                isBestseller: dto.isBestseller ?? false,
                dietaryTags: dto.dietaryTags ?? [],
            },
            include: { category: true },
        });
    }
    async updateItem(id, dto) {
        const item = await this.prisma.menuItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        return this.prisma.menuItem.update({
            where: { id },
            data: dto,
            include: { category: true },
        });
    }
    async deleteItem(id) {
        const item = await this.prisma.menuItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        return this.prisma.menuItem.delete({ where: { id } });
    }
    async uploadItemImage(id, file) {
        const item = await this.prisma.menuItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        if (item.imageUrl) {
            const filename = item.imageUrl.replace('/uploads/', '');
            await this.uploadsService.deleteFile(filename).catch(() => { });
        }
        const url = await this.uploadsService.saveFile(file);
        return this.prisma.menuItem.update({
            where: { id },
            data: { imageUrl: url },
        });
    }
    async getBestsellers(merchantId) {
        const categories = await this.prisma.menuCategory.findMany({
            where: { merchantId, isActive: true },
            include: {
                items: {
                    where: { isAvailable: true, isBestseller: true },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        return categories;
    }
    async bulkImport(merchantId, items) {
        const results = [];
        for (const item of items) {
            let category = await this.prisma.menuCategory.findFirst({
                where: { merchantId, name: item.categoryName },
            });
            if (!category) {
                category = await this.prisma.menuCategory.create({
                    data: {
                        merchantId,
                        name: item.categoryName,
                        sortOrder: 0,
                    },
                });
            }
            const created = await this.prisma.menuItem.create({
                data: {
                    categoryId: category.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    currency: item.currency ?? 'ARS',
                    isAvailable: item.isAvailable ?? true,
                    sortOrder: item.sortOrder ?? 0,
                    isBestseller: item.isBestseller ?? false,
                    dietaryTags: item.dietaryTags ?? [],
                },
            });
            results.push(created);
        }
        return { imported: results.length, items: results };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = MenuService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService])
], MenuService);
//# sourceMappingURL=menu.service.js.map