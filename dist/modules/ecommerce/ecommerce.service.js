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
var EcommerceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcommerceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let EcommerceService = EcommerceService_1 = class EcommerceService {
    prisma;
    logger = new common_1.Logger(EcommerceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicMerchant(slug) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { slug },
            include: {
                locations: true,
                loyaltyPrograms: { where: { isActive: true } },
                promotions: {
                    where: { isActive: true, claimEndsAt: { gte: new Date() } },
                },
            },
        });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        return merchant;
    }
    async getPublicRewards(slug) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        return this.prisma.reward.findMany({
            where: { merchantId: merchant.id, isActive: true },
            orderBy: { requiredPoints: 'asc' },
        });
    }
    async claimPromotion(slug, promotionId, customerId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        const promotion = await this.prisma.promotion.findUnique({
            where: { id: promotionId },
        });
        if (!promotion || promotion.merchantId !== merchant.id) {
            throw new common_1.NotFoundException('Promotion not found');
        }
        if (!promotion.isActive) {
            throw new common_1.NotFoundException('Promotion is not active');
        }
        const existing = await this.prisma.coupon.count({
            where: { promotionId, customerId },
        });
        if (promotion.maxClaimsPerCustomer && existing >= promotion.maxClaimsPerCustomer) {
            throw new common_1.NotFoundException('Max claims reached');
        }
        const total = await this.prisma.coupon.count({ where: { promotionId } });
        if (promotion.maxClaims && total >= promotion.maxClaims) {
            throw new common_1.NotFoundException('Promotion fully claimed');
        }
        const code = `CPN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const coupon = await this.prisma.coupon.create({
            data: {
                promotionId,
                customerId,
                merchantId: merchant.id,
                code,
                expiresAt: promotion.validTo,
            },
        });
        return coupon;
    }
};
exports.EcommerceService = EcommerceService;
exports.EcommerceService = EcommerceService = EcommerceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EcommerceService);
//# sourceMappingURL=ecommerce.service.js.map