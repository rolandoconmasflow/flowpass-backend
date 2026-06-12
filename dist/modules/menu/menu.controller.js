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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const subscription_guard_1 = require("../billing/subscription.guard");
const menu_service_1 = require("./menu.service");
const menu_dto_1 = require("./dto/menu.dto");
let MenuController = class MenuController {
    menuService;
    constructor(menuService) {
        this.menuService = menuService;
    }
    async getFullMenu(merchantId, lang) {
        return this.menuService.getFullMenu(merchantId, lang);
    }
    async getBestsellers(merchantId) {
        return this.menuService.getBestsellers(merchantId);
    }
    async createCategory(dto) {
        return this.menuService.createCategory(dto);
    }
    async updateCategory(id, dto) {
        return this.menuService.updateCategory(id, dto);
    }
    async deleteCategory(id) {
        return this.menuService.deleteCategory(id);
    }
    async createItem(dto) {
        return this.menuService.createItem(dto);
    }
    async updateItem(id, dto) {
        return this.menuService.updateItem(id, dto);
    }
    async deleteItem(id) {
        return this.menuService.deleteItem(id);
    }
    async uploadItemImage(id, file) {
        return this.menuService.uploadItemImage(id, file);
    }
    async bulkImport(dto) {
        return this.menuService.bulkImport(dto.merchantId, dto.items);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Get)(':merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full menu for a merchant (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getFullMenu", null);
__decorate([
    (0, common_1.Get)(':merchantId/bestsellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bestseller items (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bestsellers returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getBestsellers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a menu category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_dto_1.CreateMenuCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a menu category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, menu_dto_1.UpdateMenuCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a menu category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a menu item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menu_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createItem", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a menu item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, menu_dto_1.UpdateMenuItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateItem", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a menu item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteItem", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('items/:id/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: (0, multer_1.memoryStorage)() })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload item image' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image uploaded.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "uploadItemImage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('bulk-import'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk import menu items from CSV/JSON' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Items imported.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "bulkImport", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('Menu Digital'),
    (0, common_1.Controller)('menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map