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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let DashboardService = DashboardService_1 = class DashboardService {
    prisma;
    logger = new common_1.Logger(DashboardService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMerchantDashboard(merchantId) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [activeMemberships, totalVisits, recentVisits, totalCoupons, redeemedCoupons, totalPoints, recentMemberships, topCustomers,] = await Promise.all([
            this.prisma.membership.count({ where: { merchantId, status: 'ACTIVE' } }),
            this.prisma.visit.count({ where: { merchantId } }),
            this.prisma.visit.count({ where: { merchantId, createdAt: { gte: thirtyDaysAgo } } }),
            this.prisma.coupon.count({ where: { merchantId } }),
            this.prisma.coupon.count({ where: { merchantId, status: 'REDEEMED' } }),
            this.prisma.membership.aggregate({ where: { merchantId }, _sum: { points: true } }),
            this.prisma.membership.count({ where: { merchantId, joinedAt: { gte: thirtyDaysAgo } } }),
            this.prisma.membership.findMany({
                where: { merchantId },
                orderBy: { points: 'desc' },
                take: 5,
                include: { customer: { include: { user: { select: { name: true, email: true } } } } },
            }),
        ]);
        const redemptionRate = totalCoupons > 0 ? Math.round((redeemedCoupons / totalCoupons) * 100) : 0;
        return {
            overview: {
                activeMemberships,
                totalVisits,
                recentVisits,
                totalCoupons,
                redeemedCoupons,
                redemptionRate,
                totalPointsIssued: totalPoints._sum.points || 0,
                newMemberships: recentMemberships,
            },
            topCustomers: topCustomers.map((m) => ({
                name: m.customer.user.name || 'Anónimo',
                email: m.customer.user.email,
                points: m.points,
                visits: m.visitsCount,
                level: m.level,
            })),
        };
    }
    async getAdminDashboard() {
        const [merchants, customers, visits, coupons, activeMemberships] = await Promise.all([
            this.prisma.merchant.count(),
            this.prisma.customerProfile.count(),
            this.prisma.visit.count(),
            this.prisma.coupon.count(),
            this.prisma.membership.count({ where: { status: 'ACTIVE' } }),
        ]);
        const recentMerchants = await this.prisma.merchant.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, name: true, slug: true, createdAt: true },
        });
        return {
            stats: { merchants, customers, visits, coupons, activeMemberships },
            recentMerchants,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map