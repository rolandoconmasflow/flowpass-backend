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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let CouponsService = class CouponsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCustomerProfileByUserId(userId) {
        return this.prisma.customerProfile.findUnique({
            where: { userId },
        });
    }
    async createCoupon(data) {
        return await this.prisma.coupon.create({
            data,
        });
    }
    async getCouponsByCustomer(customerId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { customerId };
        const [data, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                include: { promotion: true, merchant: true },
                orderBy: { claimedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.coupon.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getCouponsByUserId(userId, query) {
        let customerProfile = await this.prisma.customerProfile.findUnique({
            where: { userId },
        });
        if (!customerProfile) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.BadRequestException('User not found');
            customerProfile = await this.prisma.customerProfile.upsert({
                where: { userId: user.id },
                create: { userId: user.id, displayName: user.name || user.email },
                update: { displayName: user.name || user.email },
            });
        }
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { customerId: customerProfile.id };
        const [data, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                include: { promotion: true, merchant: true },
                orderBy: { claimedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.coupon.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getAllCoupons(query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.coupon.findMany({
                include: {
                    promotion: true,
                    merchant: true,
                    customer: {
                        include: { user: true },
                    },
                },
                orderBy: { claimedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.coupon.count(),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getCouponsByMerchant(merchantId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { merchantId };
        const [data, total] = await Promise.all([
            this.prisma.coupon.findMany({
                where,
                include: {
                    promotion: true,
                    customer: {
                        include: { user: true },
                    },
                },
                orderBy: { claimedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.coupon.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async cancelCoupon(id) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { id },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        if (coupon.status === client_1.CouponStatus.REDEEMED) {
            throw new common_1.BadRequestException('Cannot cancel a redeemed coupon');
        }
        return await this.prisma.coupon.update({
            where: { id },
            data: { status: client_1.CouponStatus.CANCELLED },
            include: {
                promotion: true,
                merchant: true,
                customer: {
                    include: { user: true },
                },
            },
        });
    }
    async getCouponByCode(code) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
            include: {
                promotion: true,
                merchant: true,
                customer: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return {
            isValid: coupon.status === client_1.CouponStatus.CLAIMED,
            coupon,
            summary: {
                code: coupon.code,
                status: coupon.status,
                merchant: coupon.merchant?.name,
                promotionTitle: coupon.promotion?.title,
                promotionDescription: coupon.promotion?.description,
                customer: coupon.customer?.user?.name || coupon.customer?.user?.email,
                claimedAt: coupon.claimedAt,
                expiresAt: coupon.expiresAt,
                redeemedAt: coupon.redeemedAt,
            },
        };
    }
    async redeemCoupon(code) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
            include: {
                promotion: true,
                merchant: true,
                customer: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        if (coupon.status === client_1.CouponStatus.REDEEMED) {
            return {
                message: 'Coupon already redeemed',
                coupon,
            };
        }
        if (coupon.status !== client_1.CouponStatus.CLAIMED) {
            throw new common_1.BadRequestException(`Coupon cannot be redeemed with status ${coupon.status}`);
        }
        const redeemedCoupon = await this.prisma.coupon.update({
            where: { code },
            data: {
                status: client_1.CouponStatus.REDEEMED,
                redeemedAt: new Date(),
                redemptionChannel: client_1.RedemptionChannel.ADMIN_PANEL,
            },
            include: {
                promotion: true,
                merchant: true,
                customer: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return {
            message: 'Coupon redeemed successfully',
            coupon: redeemedCoupon,
            summary: {
                code: redeemedCoupon.code,
                status: redeemedCoupon.status,
                merchant: redeemedCoupon.merchant?.name,
                promotionTitle: redeemedCoupon.promotion?.title,
                customer: redeemedCoupon.customer?.user?.name || redeemedCoupon.customer?.user?.email,
                claimedAt: redeemedCoupon.claimedAt,
                redeemedAt: redeemedCoupon.redeemedAt,
            },
        };
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map