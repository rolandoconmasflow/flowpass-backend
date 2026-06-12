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
exports.CouponsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coupons_service_1 = require("./coupons.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const client_1 = require("@prisma/client");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let CouponsController = class CouponsController {
    couponsService;
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async getMyCoupons(req, query) {
        return await this.couponsService.getCouponsByUserId(req.user.id, query);
    }
    async getCustomerCoupons(customerId, req, query) {
        const isStaffOrAbove = req.user.role === 'SUPER_ADMIN' ||
            req.user.role === 'MERCHANT_OWNER' ||
            req.user.role === 'MERCHANT_STAFF';
        if (!isStaffOrAbove) {
            const ownProfile = await this.couponsService.findCustomerProfileByUserId(req.user.id);
            if (!ownProfile || ownProfile.id !== customerId) {
                throw new common_1.ForbiddenException('No tienes permiso para ver estos cupones');
            }
        }
        return await this.couponsService.getCouponsByCustomer(customerId, query);
    }
    async getAllCoupons(query) {
        return await this.couponsService.getAllCoupons(query);
    }
    async getCouponsByMerchant(merchantId, query) {
        return await this.couponsService.getCouponsByMerchant(merchantId, query);
    }
    async cancelCoupon(id) {
        return await this.couponsService.cancelCoupon(id);
    }
    async getCoupon(code) {
        return await this.couponsService.getCouponByCode(code);
    }
    async redeemCoupon(code) {
        return await this.couponsService.redeemCoupon(code);
    }
};
exports.CouponsController = CouponsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get own coupons' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons returned.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getMyCoupons", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('customer/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupons by customer ID (own or staff)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons returned.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getCustomerCoupons", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coupons (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getAllCoupons", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupons by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupons returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getCouponsByMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a coupon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon cancelled.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "cancelCoupon", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon by code (staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Coupon not found.' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "getCoupon", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Post)(':code/redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a coupon (staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Coupon redeemed.' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "redeemCoupon", null);
exports.CouponsController = CouponsController = __decorate([
    (0, swagger_1.ApiTags)('Coupons'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService])
], CouponsController);
//# sourceMappingURL=coupons.controller.js.map