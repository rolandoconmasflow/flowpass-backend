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
var MissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let MissionsService = MissionsService_1 = class MissionsService {
    prisma;
    logger = new common_1.Logger(MissionsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.mission.create({ data });
    }
    async findByMerchant(merchantId) {
        return this.prisma.mission.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const mission = await this.prisma.mission.findUnique({
            where: { id },
            include: { customerMissions: true },
        });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        return mission;
    }
    async update(id, data) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        return this.prisma.mission.update({ where: { id }, data });
    }
    async delete(id) {
        const mission = await this.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        return this.prisma.mission.delete({ where: { id } });
    }
    async getCustomerMissions(customerId) {
        return this.prisma.customerMission.findMany({
            where: { customerId },
            include: { mission: true },
            orderBy: { mission: { createdAt: 'desc' } },
        });
    }
    async trackProgress(customerId, missionId, increment = 1) {
        const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
        if (!mission)
            throw new common_1.NotFoundException('Mission not found');
        const existing = await this.prisma.customerMission.upsert({
            where: { customerId_missionId: { customerId, missionId } },
            create: { customerId, missionId, progress: increment },
            update: { progress: { increment } },
        });
        if (!existing.completed && existing.progress >= mission.goalValue) {
            const completed = await this.prisma.customerMission.update({
                where: { id: existing.id },
                data: { completed: true, completedAt: new Date() },
            });
            if (mission.rewardPoints > 0) {
                const membership = await this.prisma.membership.findFirst({
                    where: { customerId, merchantId: mission.merchantId },
                });
                if (membership) {
                    await this.prisma.membership.update({
                        where: { id: membership.id },
                        data: { points: { increment: mission.rewardPoints } },
                    });
                }
            }
            this.logger.log(`Mission completed: customer=${customerId} mission=${missionId}`);
            return completed;
        }
        return existing;
    }
    async getActiveMissionsForCustomer(customerId) {
        const customer = await this.prisma.customerProfile.findUnique({
            where: { id: customerId },
            select: { memberships: { select: { merchantId: true } } },
        });
        if (!customer)
            return [];
        const merchantIds = customer.memberships.map((m) => m.merchantId);
        const missions = await this.prisma.mission.findMany({
            where: {
                merchantId: { in: merchantIds },
                isActive: true,
                OR: [
                    { endsAt: null },
                    { endsAt: { gte: new Date() } },
                ],
            },
            include: {
                customerMissions: { where: { customerId } },
            },
        });
        return missions.map((m) => ({
            ...m,
            customerProgress: m.customerMissions[0] || null,
            customerMissions: undefined,
        }));
    }
};
exports.MissionsService = MissionsService;
exports.MissionsService = MissionsService = MissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MissionsService);
//# sourceMappingURL=missions.service.js.map