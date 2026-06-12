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
exports.LoyaltyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const loyalty_service_1 = require("./loyalty.service");
const loyalty_dto_1 = require("../../dtos/loyalty.dto");
let LoyaltyController = class LoyaltyController {
    loyaltyService;
    constructor(loyaltyService) {
        this.loyaltyService = loyaltyService;
    }
    async createProgram(dto) {
        return this.loyaltyService.createProgram(dto);
    }
    async getAllPrograms() {
        return this.loyaltyService.getAllPrograms();
    }
    async getProgramsByMerchant(merchantId) {
        return this.loyaltyService.getProgramsByMerchant(merchantId);
    }
    async getProgramById(id) {
        return this.loyaltyService.getProgramById(id);
    }
    async updateProgram(id, dto) {
        return this.loyaltyService.updateProgram(id, dto);
    }
    async deleteProgram(id) {
        return this.loyaltyService.deleteProgram(id);
    }
    async createReward(dto) {
        return this.loyaltyService.createReward(dto);
    }
    async getAllRewards() {
        return this.loyaltyService.getAllRewards();
    }
    async getRewardsByMerchant(merchantId) {
        return this.loyaltyService.getRewardsByMerchant(merchantId);
    }
    async getRewardById(id) {
        return this.loyaltyService.getRewardById(id);
    }
    async updateReward(id, dto) {
        return this.loyaltyService.updateReward(id, dto);
    }
    async deleteReward(id) {
        return this.loyaltyService.deleteReward(id);
    }
};
exports.LoyaltyController = LoyaltyController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('programs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a loyalty program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Loyalty program created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loyalty_dto_1.CreateLoyaltyProgramDto]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "createProgram", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('programs'),
    (0, swagger_1.ApiOperation)({ summary: 'List all loyalty programs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Loyalty programs returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getAllPrograms", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('programs/merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get programs by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Programs returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getProgramsByMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('programs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get loyalty program by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Program found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getProgramById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)('programs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a loyalty program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Program updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, loyalty_dto_1.UpdateLoyaltyProgramDto]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "updateProgram", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)('programs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a loyalty program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Program deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "deleteProgram", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('rewards'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a reward' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reward created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loyalty_dto_1.CreateRewardDto]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "createReward", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rewards'),
    (0, swagger_1.ApiOperation)({ summary: 'List all rewards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rewards returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getAllRewards", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rewards/merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rewards by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rewards returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getRewardsByMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rewards/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reward by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reward found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "getRewardById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)('rewards/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a reward' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reward updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, loyalty_dto_1.UpdateRewardDto]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "updateReward", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)('rewards/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a reward' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reward deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyController.prototype, "deleteReward", null);
exports.LoyaltyController = LoyaltyController = __decorate([
    (0, swagger_1.ApiTags)('Loyalty'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('loyalty'),
    __metadata("design:paramtypes", [loyalty_service_1.LoyaltyService])
], LoyaltyController);
//# sourceMappingURL=loyalty.controller.js.map