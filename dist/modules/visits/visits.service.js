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
var VisitsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let VisitsService = VisitsService_1 = class VisitsService {
    prisma;
    logger = new common_1.Logger(VisitsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCustomerProfileByUserId(userId) {
        return this.prisma.customerProfile.findUnique({ where: { userId } });
    }
    async getVisitsByCustomer(customerId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { customerId };
        const [data, total] = await Promise.all([
            this.prisma.visit.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.visit.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getVisitsByMerchant(merchantId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { merchantId };
        const [data, total] = await Promise.all([
            this.prisma.visit.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.visit.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getVisitsByLocation(locationId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { locationId };
        const [data, total] = await Promise.all([
            this.prisma.visit.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
            this.prisma.visit.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async checkIn(userId, code) {
        const customerProfile = await this.prisma.customerProfile.findUnique({
            where: { userId },
        });
        if (!customerProfile) {
            throw new common_1.BadRequestException('Customer profile not found for authenticated user');
        }
        const qrCode = await this.prisma.qRCode.findUnique({
            where: { code },
            include: { merchant: true, location: true },
        });
        if (!qrCode || !qrCode.isActive) {
            throw new common_1.NotFoundException('QR code not found or inactive');
        }
        const loyaltyProgram = await this.prisma.loyaltyProgram.findFirst({
            where: { merchantId: qrCode.merchantId, isActive: true },
        });
        const result = await this.prisma.$transaction(async (tx) => {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const recentVisit = await tx.visit.findFirst({
                where: {
                    customerId: customerProfile.id,
                    merchantId: qrCode.merchantId,
                    createdAt: { gte: oneHourAgo },
                },
                orderBy: { createdAt: 'desc' },
            });
            if (recentVisit) {
                throw new common_1.BadRequestException('A visit was already registered recently');
            }
            const membership = await tx.membership.upsert({
                where: {
                    customerId_merchantId: {
                        customerId: customerProfile.id,
                        merchantId: qrCode.merchantId,
                    },
                },
                create: {
                    customerId: customerProfile.id,
                    merchantId: qrCode.merchantId,
                    loyaltyProgramId: loyaltyProgram?.id || null,
                    points: 0,
                    visitsCount: 0,
                    status: 'ACTIVE',
                    level: 'BRONZE',
                    joinedAt: new Date(),
                },
                update: {},
            });
            const visit = await tx.visit.create({
                data: {
                    membershipId: membership.id,
                    merchantId: qrCode.merchantId,
                    locationId: qrCode.locationId,
                    customerId: customerProfile.id,
                    source: 'QR_CHECKIN',
                    qrCodeId: qrCode.id,
                },
                include: { merchant: true, location: true, membership: true },
            });
            const pointsToAdd = loyaltyProgram?.type === 'POINTS' ? loyaltyProgram.pointsPerVisit : 1;
            const updatedMembership = await tx.membership.update({
                where: { id: membership.id },
                data: {
                    points: { increment: pointsToAdd },
                    visitsCount: { increment: 1 },
                },
            });
            return { visit, updatedMembership, pointsToAdd };
        });
        this.logger.log(`Check-in successful for user ${userId} at merchant ${qrCode.merchantId}`);
        const upgraded = await this.evaluateLevelUpgrade(result.updatedMembership.id);
        const achievementsAwarded = await this.evaluateAchievements(result.updatedMembership.customerId, qrCode.merchantId);
        return {
            message: 'Check-in registered successfully',
            visit: result.visit,
            pointsAdded: result.pointsToAdd,
            totalPoints: result.updatedMembership.points,
            totalVisits: result.updatedMembership.visitsCount,
            membership: result.updatedMembership,
            merchant: qrCode.merchant,
            location: qrCode.location,
            levelUpgrade: upgraded || undefined,
            achievementsAwarded: achievementsAwarded.length > 0 ? achievementsAwarded : undefined,
        };
    }
    async evaluateLevelUpgrade(membershipId) {
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
        });
        if (!membership)
            return null;
        const levels = await this.prisma.loyaltyLevel.findMany({
            where: { merchantId: membership.merchantId, isActive: true },
            orderBy: { sortOrder: 'desc' },
        });
        if (levels.length === 0)
            return null;
        const bestLevel = levels.find((l) => membership.points >= l.minPoints && membership.visitsCount >= l.minVisits);
        if (bestLevel && bestLevel.id !== membership.levelId) {
            await this.prisma.membership.update({
                where: { id: membershipId },
                data: { levelId: bestLevel.id, level: bestLevel.name },
            });
            return { name: bestLevel.name, color: bestLevel.color };
        }
        return null;
    }
    async evaluateAchievements(customerId, merchantId) {
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
            if (typeof criteria.minVisits === 'number' && membership.visitsCount < criteria.minVisits)
                meets = false;
            if (typeof criteria.minPoints === 'number' && membership.points < criteria.minPoints)
                meets = false;
            if (typeof criteria.maxVisits === 'number' && membership.visitsCount > criteria.maxVisits)
                meets = false;
            if (meets) {
                await this.prisma.customerAchievement.create({
                    data: { customerId, achievementId: achievement.id },
                });
                if (achievement.points > 0) {
                    await this.prisma.membership.update({
                        where: { id: membership.id },
                        data: { points: { increment: achievement.points } },
                    });
                }
                awarded.push(achievement.name);
            }
        }
        return awarded;
    }
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = VisitsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map