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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let PromotionsService = class PromotionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPromotion(data) {
        return await this.prisma.promotion.create({ data: data });
    }
    async getAllPromotions(query) {
        if (!query) {
            return await this.prisma.promotion.findMany({ include: { merchant: true } });
        }
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.promotion.findMany({
                skip,
                take: limit,
                include: { merchant: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.promotion.count(),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getPromotionById(id) {
        return await this.prisma.promotion.findUnique({
            where: { id },
            include: { merchant: true },
        });
    }
    async getPromotionsByMerchant(merchantId, query) {
        if (!query) {
            return await this.prisma.promotion.findMany({ where: { merchantId } });
        }
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.promotion.findMany({
                where: { merchantId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.promotion.count({ where: { merchantId } }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async updatePromotion(id, data) {
        return await this.prisma.promotion.update({
            where: { id },
            data: data,
        });
    }
    async deletePromotion(id) {
        return await this.prisma.promotion.delete({
            where: { id },
        });
    }
    generateCouponCode() {
        const random = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `FLOW-${Date.now().toString(36).toUpperCase()}-${random}`;
    }
    async getNearbyPromotions(lat, lng, radiusKm = 10) {
        const locations = await this.prisma.merchantLocation.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null },
            },
            include: {
                promotions: { include: { merchant: true } },
                merchant: true,
            },
        });
        const nearbyPromotions = locations
            .filter((loc) => {
            if (loc.latitude === null || loc.longitude === null)
                return false;
            return this.haversine(lat, lng, loc.latitude, loc.longitude) <= radiusKm;
        })
            .flatMap((loc) => {
            const distance = this.haversine(lat, lng, loc.latitude, loc.longitude);
            return loc.promotions.map((promo) => ({
                ...promo,
                location: {
                    id: loc.id,
                    name: loc.name,
                    address: loc.address,
                    distance,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                },
            }));
        })
            .sort((a, b) => a.location.distance - b.location.distance);
        return nearbyPromotions;
    }
    haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
    async claimPromotion(promotionId, authUser) {
        const userId = authUser?.id;
        if (!userId) {
            throw new common_1.BadRequestException('Authenticated user not found');
        }
        const promotion = await this.prisma.promotion.findUnique({
            where: { id: promotionId },
            include: {
                merchant: true,
            },
        });
        if (!promotion) {
            throw new common_1.NotFoundException('Promotion not found');
        }
        const customerProfile = await this.prisma.customerProfile.findUnique({
            where: { userId },
        });
        if (!customerProfile) {
            throw new common_1.BadRequestException('Customer profile not found for authenticated user');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const existingCoupon = await tx.coupon.findFirst({
                where: {
                    promotionId,
                    customerId: customerProfile.id,
                    status: 'CLAIMED',
                },
            });
            if (existingCoupon) {
                const full = await tx.coupon.findUnique({
                    where: { id: existingCoupon.id },
                    include: { promotion: true, merchant: true },
                });
                return { isNew: false, coupon: full };
            }
            const coupon = await tx.coupon.create({
                data: {
                    promotionId: promotion.id,
                    customerId: customerProfile.id,
                    merchantId: promotion.merchantId,
                    locationId: promotion.locationId || null,
                    code: this.generateCouponCode(),
                    qrCodeValue: `FLOWPASS-COUPON-${promotion.id}-${customerProfile.id}`,
                    expiresAt: promotion.claimEndsAt || promotion.validTo || null,
                },
                include: {
                    promotion: true,
                    merchant: true,
                },
            });
            return { isNew: true, coupon };
        });
        return {
            message: result.isNew ? 'Coupon claimed successfully' : 'Coupon already claimed',
            coupon: result.coupon,
        };
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map