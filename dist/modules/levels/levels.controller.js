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
exports.LevelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const subscription_guard_1 = require("../billing/subscription.guard");
const levels_service_1 = require("./levels.service");
const level_dto_1 = require("../../dtos/level.dto");
let LevelsController = class LevelsController {
    levelsService;
    constructor(levelsService) {
        this.levelsService = levelsService;
    }
    async create(dto) {
        return this.levelsService.create(dto);
    }
    async findByMerchant(merchantId) {
        return this.levelsService.findByMerchant(merchantId);
    }
    async findById(id) {
        return this.levelsService.findById(id);
    }
    async update(id, dto) {
        return this.levelsService.update(id, dto);
    }
    async delete(id) {
        return this.levelsService.delete(id);
    }
    async getMembershipLevel(membershipId) {
        return this.levelsService.getMembershipLevel(membershipId);
    }
    async enableLevels(merchantId) {
        return this.levelsService.enableLevelsForMerchant(merchantId);
    }
    async disableLevels(merchantId) {
        return this.levelsService.disableLevelsForMerchant(merchantId);
    }
    async getLevelsStatus(merchantId) {
        return this.levelsService.getMerchantLevelsStatus(merchantId);
    }
};
exports.LevelsController = LevelsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a loyalty level' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Level created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [level_dto_1.CreateLevelDto]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get levels by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Levels returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "findByMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get level by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Level found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a level' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Level updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, level_dto_1.UpdateLevelDto]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a level' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Level deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('membership/:membershipId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get level for a membership' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Level returned.' }),
    __param(0, (0, common_1.Param)('membershipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getMembershipLevel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('merchant/:merchantId/enable'),
    (0, swagger_1.ApiOperation)({ summary: 'Enable loyalty levels for a merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Levels enabled.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "enableLevels", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('merchant/:merchantId/disable'),
    (0, swagger_1.ApiOperation)({ summary: 'Disable loyalty levels for a merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Levels disabled.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "disableLevels", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('merchant/:merchantId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get levels enabled status for a merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getLevelsStatus", null);
exports.LevelsController = LevelsController = __decorate([
    (0, swagger_1.ApiTags)('Levels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('levels'),
    __metadata("design:paramtypes", [levels_service_1.LevelsService])
], LevelsController);
//# sourceMappingURL=levels.controller.js.map