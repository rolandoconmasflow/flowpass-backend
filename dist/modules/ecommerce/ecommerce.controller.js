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
exports.EcommerceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ecommerce_service_1 = require("./ecommerce.service");
let EcommerceController = class EcommerceController {
    ecommerceService;
    constructor(ecommerceService) {
        this.ecommerceService = ecommerceService;
    }
    async getMerchant(slug) {
        return this.ecommerceService.getPublicMerchant(slug);
    }
    async getRewards(slug) {
        return this.ecommerceService.getPublicRewards(slug);
    }
    async claimPromotion(slug, promotionId, customerId) {
        return this.ecommerceService.claimPromotion(slug, promotionId, customerId);
    }
};
exports.EcommerceController = EcommerceController;
__decorate([
    (0, common_1.Get)('merchant/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public merchant data by slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "getMerchant", null);
__decorate([
    (0, common_1.Get)('rewards/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public rewards by merchant slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "getRewards", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('claim/:slug/:promotionId/:customerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Claim a promotion' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('promotionId')),
    __param(2, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EcommerceController.prototype, "claimPromotion", null);
exports.EcommerceController = EcommerceController = __decorate([
    (0, swagger_1.ApiTags)('Ecommerce'),
    (0, common_1.Controller)('ecommerce'),
    __metadata("design:paramtypes", [ecommerce_service_1.EcommerceService])
], EcommerceController);
//# sourceMappingURL=ecommerce.controller.js.map