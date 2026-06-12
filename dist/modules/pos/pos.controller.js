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
exports.PosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const pos_service_1 = require("./pos.service");
class PosCheckInDto {
    merchantId;
    locationId;
    customerPhone;
}
class PosRedeemCouponDto {
    merchantId;
    code;
}
let PosController = class PosController {
    posService;
    constructor(posService) {
        this.posService = posService;
    }
    async checkIn(dto) {
        return this.posService.checkInCustomer(dto.merchantId, dto.locationId, dto.customerPhone);
    }
    async redeemCoupon(dto) {
        return this.posService.redeemCoupon(dto.merchantId, dto.code);
    }
    async redeemReward(merchantId, customerId, rewardId) {
        return this.posService.redeemReward(merchantId, customerId, rewardId);
    }
    async lookupCustomer(merchantId, query) {
        return this.posService.lookupCustomer(merchantId, query);
    }
};
exports.PosController = PosController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Post)('checkin'),
    (0, swagger_1.ApiOperation)({ summary: 'POS check-in by phone' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PosCheckInDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "checkIn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Post)('redeem-coupon'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a coupon by code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PosRedeemCouponDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "redeemCoupon", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Post)('redeem-reward/:merchantId/:customerId/:rewardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a reward at POS' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Param)('customerId')),
    __param(2, (0, common_1.Param)('rewardId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "redeemReward", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)('lookup/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lookup customer by phone/email/name' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "lookupCustomer", null);
exports.PosController = PosController = __decorate([
    (0, swagger_1.ApiTags)('POS'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('pos'),
    __metadata("design:paramtypes", [pos_service_1.PosService])
], PosController);
//# sourceMappingURL=pos.controller.js.map