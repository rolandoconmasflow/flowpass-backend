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
exports.MerchantsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const subscription_guard_1 = require("../billing/subscription.guard");
const auth_service_1 = require("../auth/auth.service");
const merchants_service_1 = require("./merchants.service");
const merchant_dto_1 = require("../../dtos/merchant.dto");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let MerchantsController = class MerchantsController {
    merchantsService;
    authService;
    constructor(merchantsService, authService) {
        this.merchantsService = merchantsService;
        this.authService = authService;
    }
    async register(dto) {
        return this.merchantsService.register(dto);
    }
    async findPublic() {
        return this.merchantsService.findPublic();
    }
    async findAll(query) {
        return await this.merchantsService.findAll(query);
    }
    async getCategories() {
        return [
            'RESTAURANT',
            'CAFE',
            'FAST_FOOD',
            'BAR',
            'BAKERY',
            'ICE_CREAM',
            'GROCERY',
            'CONVENIENCE',
            'PHARMACY',
            'CLOTHING',
            'ELECTRONICS',
            'BEAUTY',
            'SPORTS',
            'HOME',
            'AUTOMOTIVE',
            'ENTERTAINMENT',
            'HEALTH',
            'EDUCATION',
            'TRAVEL',
            'PETS',
            'BOOKS',
            'PROFESSIONAL_SERVICES',
            'OTHER',
        ];
    }
    async getMyMerchant(req) {
        const activeMerchantId = req.user.activeMerchantId;
        if (activeMerchantId) {
            const merchant = await this.merchantsService.findOne(activeMerchantId);
            if (merchant)
                return merchant;
        }
        const merchant = await this.merchantsService.findByOwnerId(req.user.id);
        if (!merchant) {
            throw new common_1.NotFoundException('No tienes un comercio registrado');
        }
        return merchant;
    }
    async getMyMerchants(req) {
        return await this.merchantsService.findAllByOwnerId(req.user.id);
    }
    async switchMerchant(req, id) {
        const merchant = await this.merchantsService.switchActiveMerchant(req.user.id, id);
        const access_token = this.authService.signTokenWithMerchant(req.user.id, id);
        return {
            merchant,
            access_token,
            activeMerchantId: id,
        };
    }
    async findOne(id) {
        return await this.merchantsService.findOne(id);
    }
    async create(createMerchantDto) {
        return await this.merchantsService.create(createMerchantDto);
    }
    async update(req, id, updateMerchantDto) {
        if (req.user.role === 'MERCHANT_OWNER') {
            await this.merchantsService.switchActiveMerchant(req.user.id, id);
        }
        return await this.merchantsService.update(id, updateMerchantDto);
    }
    async uploadLogo(req, id, file) {
        if (req.user.role === 'MERCHANT_OWNER') {
            await this.merchantsService.switchActiveMerchant(req.user.id, id);
        }
        return this.merchantsService.updateLogo(id, file);
    }
    async getLogo(id) {
        return this.merchantsService.getLogo(id);
    }
};
exports.MerchantsController = MerchantsController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new merchant (public)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Merchant registered.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_dto_1.RegisterMerchantDto]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'List active merchants (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public merchant list returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all merchants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchants returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all merchant categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my active merchant profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No tienes un comercio registrado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMyMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all merchants owned by the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchants list returned.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getMyMerchants", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('switch/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Switch active merchant context' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active merchant changed.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Merchant not found or not owned by you' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "switchMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a merchant (SUPER_ADMIN only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Merchant created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [merchant_dto_1.CreateMerchantDto]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant updated.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, merchant_dto_1.UpdateMerchantDto]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)(':id/logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', { storage: (0, multer_1.memoryStorage)() })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload merchant logo' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                logo: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logo uploaded.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/logo'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant logo URL' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logo URL returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantsController.prototype, "getLogo", null);
exports.MerchantsController = MerchantsController = __decorate([
    (0, swagger_1.ApiTags)('Merchants'),
    (0, common_1.Controller)('merchants'),
    __metadata("design:paramtypes", [merchants_service_1.MerchantsService,
        auth_service_1.AuthService])
], MerchantsController);
//# sourceMappingURL=merchants.controller.js.map