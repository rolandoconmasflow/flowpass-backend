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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardData(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { ownedMerchants: true },
        });
        if (!user) {
            return { message: 'User not found' };
        }
        const isSuperAdmin = user.role === 'SUPER_ADMIN';
        const merchantIds = user.ownedMerchants.map((m) => m.id);
        const [totalMerchants, totalMemberships, totalVisits, totalPromotions, totalCoupons, activeCoupons, recentVisits,] = await Promise.all([
            isSuperAdmin
                ? this.prisma.merchant.count()
                : this.prisma.merchant.count({ where: { ownerId: userId } }),
            merchantIds.length > 0
                ? this.prisma.membership.count({ where: { merchantId: { in: merchantIds } } })
                : Promise.resolve(0),
            merchantIds.length > 0
                ? this.prisma.visit.count({ where: { merchantId: { in: merchantIds } } })
                : Promise.resolve(0),
            merchantIds.length > 0
                ? this.prisma.promotion.count({ where: { merchantId: { in: merchantIds } } })
                : Promise.resolve(0),
            merchantIds.length > 0
                ? this.prisma.coupon.count({ where: { merchantId: { in: merchantIds } } })
                : Promise.resolve(0),
            merchantIds.length > 0
                ? this.prisma.coupon.count({
                    where: { merchantId: { in: merchantIds }, status: 'CLAIMED' },
                })
                : Promise.resolve(0),
            merchantIds.length > 0
                ? this.prisma.visit.findMany({
                    where: { merchantId: { in: merchantIds } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        customer: { select: { displayName: true } },
                        merchant: { select: { name: true } },
                    },
                })
                : Promise.resolve([]),
        ]);
        return {
            totalMerchants,
            totalMemberships,
            totalVisits,
            totalPromotions,
            totalCoupons,
            activeCoupons,
            recentVisits,
            role: user.role,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map