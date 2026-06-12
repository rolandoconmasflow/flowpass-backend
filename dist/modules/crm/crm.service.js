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
var CrmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CrmService = CrmService_1 = class CrmService {
    prisma;
    logger = new common_1.Logger(CrmService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCustomers(merchantId, filters = {}) {
        const where = { merchantId };
        if (filters.minPoints)
            where.points = { ...where.points, gte: filters.minPoints };
        if (filters.maxPoints)
            where.points = { ...where.points, lte: filters.maxPoints };
        if (filters.minVisits)
            where.visitsCount = { gte: filters.minVisits };
        if (filters.level)
            where.level = filters.level;
        if (filters.status)
            where.status = filters.status;
        if (filters.joinedAfter)
            where.joinedAt = { ...where.joinedAt, gte: new Date(filters.joinedAfter) };
        if (filters.joinedBefore)
            where.joinedAt = { ...where.joinedAt, lte: new Date(filters.joinedBefore) };
        const memberships = await this.prisma.membership.findMany({
            where,
            include: {
                customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
                _count: { select: { visits: true, coupons: true } },
            },
            orderBy: { points: 'desc' },
        });
        return memberships;
    }
    async getSegments(merchantId) {
        const total = await this.prisma.membership.count({ where: { merchantId } });
        const byLevel = await this.prisma.membership.groupBy({
            by: ['level'],
            where: { merchantId },
            _count: true,
        });
        const byStatus = await this.prisma.membership.groupBy({
            by: ['status'],
            where: { merchantId },
            _count: true,
        });
        const highValue = await this.prisma.membership.count({
            where: { merchantId, points: { gte: 500 }, visitsCount: { gte: 10 } },
        });
        const atRisk = await this.prisma.membership.count({
            where: { merchantId, visitsCount: 0, joinedAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        });
        return {
            total,
            byLevel,
            byStatus,
            segments: {
                highValue,
                atRisk,
                active: total - atRisk,
            },
        };
    }
    async getCustomerTimeline(customerId, merchantId) {
        const [visits, redemptions, coupons] = await Promise.all([
            this.prisma.visit.findMany({
                where: { customerId, merchantId },
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
            this.prisma.rewardRedemption.findMany({
                where: { customerId, merchantId },
                include: { reward: true },
                orderBy: { redeemedAt: 'desc' },
                take: 50,
            }),
            this.prisma.coupon.findMany({
                where: { customerId, merchantId },
                orderBy: { createdAt: 'desc' },
                take: 50,
                include: { promotion: true },
            }),
        ]);
        return { visits, redemptions, coupons };
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = CrmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmService);
//# sourceMappingURL=crm.service.js.map