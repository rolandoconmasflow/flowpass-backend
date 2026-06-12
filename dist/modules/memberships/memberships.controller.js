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
exports.MembershipsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const memberships_service_1 = require("./memberships.service");
const membership_dto_1 = require("../../dtos/membership.dto");
let MembershipsController = class MembershipsController {
    membershipsService;
    constructor(membershipsService) {
        this.membershipsService = membershipsService;
    }
    async getMyMemberships(req) {
        const userId = req.user.id;
        const customerProfile = await this.membershipsService.findCustomerProfile(userId);
        if (!customerProfile) {
            return { message: 'Perfil de cliente no encontrado', memberships: [] };
        }
        return await this.membershipsService.getCustomerMemberships(customerProfile.id);
    }
    async getMembership(membershipId) {
        return await this.membershipsService.getMembershipById(membershipId);
    }
    async joinMerchant(req, dto) {
        const userId = req.user.id;
        const customerProfile = await this.membershipsService.findCustomerProfile(userId);
        if (!customerProfile) {
            return { message: 'Perfil de cliente no encontrado' };
        }
        const loyaltyProgramId = 'temp-loyalty-program-id';
        return await this.membershipsService.createMembership(customerProfile.id, dto.merchantId, loyaltyProgramId);
    }
    async getCustomerCard(_membershipId) {
        return { message: 'Tarjeta de cliente' };
    }
    async getCustomerCards(req) {
        const userId = req.user.id;
        const customerProfile = await this.membershipsService.findCustomerProfile(userId);
        if (!customerProfile) {
            return { message: 'Perfil de cliente no encontrado', cards: [] };
        }
        return { message: 'Tarjetas de cliente' };
    }
};
exports.MembershipsController = MembershipsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get own memberships' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Memberships returned.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getMyMemberships", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get membership by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getMembership", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join a merchant loyalty program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Membership created.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, membership_dto_1.JoinMerchantDto]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "joinMerchant", null);
__decorate([
    (0, common_1.Get)('card/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer loyalty card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Card returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getCustomerCard", null);
__decorate([
    (0, common_1.Get)('cards'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customer loyalty cards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cards returned.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "getCustomerCards", null);
exports.MembershipsController = MembershipsController = __decorate([
    (0, swagger_1.ApiTags)('Memberships'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('memberships'),
    __metadata("design:paramtypes", [memberships_service_1.MembershipsService])
], MembershipsController);
//# sourceMappingURL=memberships.controller.js.map