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
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AchievementsService = class AchievementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.achievement.create({ data: data });
    }
    async findByMerchant(merchantId) {
        return this.prisma.achievement.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findById(id) {
        const achievement = await this.prisma.achievement.findUnique({
            where: { id },
            include: { earnedBy: { include: { customer: true } } },
        });
        if (!achievement)
            throw new common_1.NotFoundException('Achievement not found');
        return achievement;
    }
    async update(id, data) {
        const achievement = await this.prisma.achievement.findUnique({ where: { id } });
        if (!achievement)
            throw new common_1.NotFoundException('Achievement not found');
        return this.prisma.achievement.update({ where: { id }, data: data });
    }
    async delete(id) {
        const achievement = await this.prisma.achievement.findUnique({ where: { id } });
        if (!achievement)
            throw new common_1.NotFoundException('Achievement not found');
        return this.prisma.achievement.delete({ where: { id } });
    }
    async awardAchievement(customerId, achievementId) {
        const achievement = await this.prisma.achievement.findUnique({ where: { id: achievementId } });
        if (!achievement)
            throw new common_1.NotFoundException('Achievement not found');
        const existing = await this.prisma.customerAchievement.findUnique({
            where: { customerId_achievementId: { customerId, achievementId } },
        });
        if (existing)
            return existing;
        const earned = await this.prisma.customerAchievement.create({
            data: { customerId, achievementId },
        });
        if (achievement.points > 0) {
            const membership = await this.prisma.membership.findFirst({
                where: { customerId, merchantId: achievement.merchantId },
            });
            if (membership) {
                await this.prisma.membership.update({
                    where: { id: membership.id },
                    data: { points: { increment: achievement.points } },
                });
            }
        }
        return earned;
    }
    async getCustomerAchievements(customerId) {
        return this.prisma.customerAchievement.findMany({
            where: { customerId },
            include: { achievement: true },
            orderBy: { earnedAt: 'desc' },
        });
    }
    async evaluateAndAward(customerId, merchantId) {
        const membership = await this.prisma.membership.findUnique({
            where: { customerId_merchantId: { customerId, merchantId } },
        });
        if (!membership)
            return [];
        const achievements = await this.prisma.achievement.findMany({
            where: { merchantId },
        });
        const awarded = [];
        for (const achievement of achievements) {
            const existing = await this.prisma.customerAchievement.findUnique({
                where: { customerId_achievementId: { customerId, achievementId: achievement.id } },
            });
            if (existing)
                continue;
            const criteria = achievement.criteria || {};
            let meets = true;
            if (typeof criteria.minVisits === 'number' && membership.visitsCount < criteria.minVisits) {
                meets = false;
            }
            if (typeof criteria.minPoints === 'number' && membership.points < criteria.minPoints) {
                meets = false;
            }
            if (typeof criteria.maxVisits === 'number' && membership.visitsCount > criteria.maxVisits) {
                meets = false;
            }
            if (meets) {
                await this.awardAchievement(customerId, achievement.id);
                awarded.push(achievement.name);
            }
        }
        return awarded;
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map