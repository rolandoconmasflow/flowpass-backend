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
exports.ReferralsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const referrals_service_1 = require("./referrals.service");
class ProcessReferralDto {
    code;
    referredId;
    merchantId;
}
let ReferralsController = class ReferralsController {
    referralsService;
    constructor(referralsService) {
        this.referralsService = referralsService;
    }
    async generateCode(customerId) {
        return this.referralsService.generateCode(customerId);
    }
    async getCode(customerId) {
        return this.referralsService.getCode(customerId);
    }
    async processReferral(dto) {
        return this.referralsService.processReferral(dto.code, dto.referredId, dto.merchantId);
    }
    async getStats(customerId, merchantId) {
        return this.referralsService.getReferralStats(customerId, merchantId);
    }
};
exports.ReferralsController = ReferralsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('code/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate or get referral code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Referral code returned.' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "generateCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('code/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral code' }),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('process'),
    (0, swagger_1.ApiOperation)({ summary: 'Process a referral' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Referral processed.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProcessReferralDto]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "processReferral", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats/:customerId/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral stats' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getStats", null);
exports.ReferralsController = ReferralsController = __decorate([
    (0, swagger_1.ApiTags)('Referrals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('referrals'),
    __metadata("design:paramtypes", [referrals_service_1.ReferralsService])
], ReferralsController);
//# sourceMappingURL=referrals.controller.js.map