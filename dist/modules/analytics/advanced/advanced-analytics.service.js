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
var AdvancedAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdvancedAnalyticsService = AdvancedAnalyticsService_1 = class AdvancedAnalyticsService {
    prisma;
    logger = new common_1.Logger(AdvancedAnalyticsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRetentionRate(merchantId, days = 90) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const [totalCustomers, customersWithVisit] = await Promise.all([
            this.prisma.membership.count({ where: { merchantId } }),
            this.prisma.membership.count({
                where: {
                    merchantId,
                    visits: { some: { createdAt: { gte: since } } },
                },
            }),
        ]);
        return {
            period: `${days}d`,
            totalCustomers,
            retained: customersWithVisit,
            retentionRate: totalCustomers > 0 ? Math.round((customersWithVisit / totalCustomers) * 100) : 0,
        };
    }
    async getCohortAnalysis(merchantId) {
        const rows = await this.prisma.$queryRaw `
      WITH cohorts AS (
        SELECT
          to_char("joinedAt", 'YYYY-MM') AS month,
          id
        FROM "Membership"
        WHERE "merchantId" = ${merchantId}
      ),
      retained AS (
        SELECT DISTINCT c.month, c.id
        FROM cohorts c
        JOIN "Visit" v ON v."membershipId" = c.id
          AND v."createdAt" >= c."joinedAt" + INTERVAL '7 days'
      )
      SELECT
        c.month,
        COUNT(DISTINCT c.id)::bigint AS total,
        COUNT(DISTINCT r.id)::bigint AS retained
      FROM cohorts c
      LEFT JOIN retained r ON r.id = c.id
      GROUP BY c.month
      ORDER BY c.month
    `;
        return rows.map((r) => ({
            month: r.month,
            total: Number(r.total),
            retained: Number(r.retained),
            retentionRate: Number(r.total) > 0 ? Math.round((Number(r.retained) / Number(r.total)) * 100) : 0,
        }));
    }
    async getPointsEconomics(merchantId) {
        const [totalVisits, totalRedemptions, pointsAgg] = await Promise.all([
            this.prisma.visit.count({ where: { merchantId } }),
            this.prisma.rewardRedemption.count({ where: { merchantId } }),
            this.prisma.membership.aggregate({
                where: { merchantId },
                _sum: { points: true },
                _count: true,
            }),
        ]);
        const totalPoints = pointsAgg._sum.points ?? 0;
        const totalCustomers = pointsAgg._count;
        return {
            totalVisits,
            totalRedemptions,
            totalPointsInCirculation: totalPoints,
            avgPointsPerCustomer: totalCustomers > 0 ? Math.round(totalPoints / totalCustomers) : 0,
        };
    }
    async getDashboard(merchantId) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [retention, economics, activeMemberships, recentVisits] = await Promise.all([
            this.getRetentionRate(merchantId),
            this.getPointsEconomics(merchantId),
            this.prisma.membership.count({ where: { merchantId, status: 'ACTIVE' } }),
            this.prisma.visit.count({ where: { merchantId, createdAt: { gte: sevenDaysAgo } } }),
        ]);
        return {
            activeMemberships,
            recentVisits,
            retention,
            economics,
        };
    }
};
exports.AdvancedAnalyticsService = AdvancedAnalyticsService;
exports.AdvancedAnalyticsService = AdvancedAnalyticsService = AdvancedAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdvancedAnalyticsService);
//# sourceMappingURL=advanced-analytics.service.js.map