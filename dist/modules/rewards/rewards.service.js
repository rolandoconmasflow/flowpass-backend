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
var RewardsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let RewardsService = RewardsService_1 = class RewardsService {
    prisma;
    logger = new common_1.Logger(RewardsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.reward.create({ data });
    }
    async findByMerchant(merchantId) {
        return this.prisma.reward.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        return reward;
    }
    async update(id, data) {
        await this.findById(id);
        return this.prisma.reward.update({ where: { id }, data });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.reward.delete({ where: { id } });
    }
    async getCustomerCatalog(customerId) {
        const customer = await this.prisma.customerProfile.findUnique({
            where: { id: customerId },
            include: { memberships: true },
        });
        if (!customer)
            return [];
        const merchantIds = customer.memberships.map((m) => m.merchantId);
        const rewards = await this.prisma.reward.findMany({
            where: {
                merchantId: { in: merchantIds },
                isActive: true,
                OR: [
                    { validTo: null },
                    { validTo: { gte: new Date() } },
                ],
            },
            include: { merchant: { select: { name: true, logoUrl: true } } },
            orderBy: { requiredPoints: 'asc' },
        });
        return rewards.map((reward) => {
            const membership = customer.memberships.find((m) => m.merchantId === reward.merchantId);
            return {
                ...reward,
                canRedeem: membership
                    ? membership.points >= (reward.requiredPoints ?? Infinity) &&
                        membership.visitsCount >= (reward.requiredVisits ?? 0)
                    : false,
                userPoints: membership?.points ?? 0,
                userVisits: membership?.visitsCount ?? 0,
            };
        });
    }
    async redeem(rewardId, customerId) {
        const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        if (!reward.isActive)
            throw new common_1.BadRequestException('Reward is not active');
        const membership = await this.prisma.membership.findUnique({
            where: { customerId_merchantId: { customerId, merchantId: reward.merchantId } },
        });
        if (!membership)
            throw new common_1.BadRequestException('No membership for this merchant');
        if (reward.requiredPoints && membership.points < reward.requiredPoints) {
            throw new common_1.BadRequestException('Not enough points');
        }
        if (reward.requiredVisits && membership.visitsCount < reward.requiredVisits) {
            throw new common_1.BadRequestException('Not enough visits');
        }
        const redemption = await this.prisma.rewardRedemption.create({
            data: {
                rewardId,
                membershipId: membership.id,
                customerId,
                merchantId: reward.merchantId,
                status: 'REDEEMED',
                redeemedAt: new Date(),
            },
        });
        if (reward.requiredPoints) {
            await this.prisma.membership.update({
                where: { id: membership.id },
                data: { points: { decrement: reward.requiredPoints } },
            });
        }
        this.logger.log(`Reward redeemed: customer=${customerId} reward=${rewardId}`);
        return redemption;
    }
    async getRedemptionHistory(membershipId) {
        return this.prisma.rewardRedemption.findMany({
            where: { membershipId },
            include: { reward: true },
            orderBy: { redeemedAt: 'desc' },
        });
    }
};
exports.RewardsService = RewardsService;
exports.RewardsService = RewardsService = RewardsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RewardsService);
//# sourceMappingURL=rewards.service.js.map