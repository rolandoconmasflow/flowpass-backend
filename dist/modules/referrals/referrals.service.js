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
var ReferralsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ReferralsService = ReferralsService_1 = class ReferralsService {
    prisma;
    logger = new common_1.Logger(ReferralsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateCode(customerId) {
        const existing = await this.prisma.referralCode.findUnique({
            where: { customerId },
        });
        if (existing)
            return existing;
        const membership = await this.prisma.membership.findFirst({
            where: { customerId },
            select: { merchantId: true },
        });
        if (!membership)
            throw new common_1.BadRequestException('Customer has no membership');
        const raw = `FLOW-${customerId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
        const code = raw.slice(0, 20);
        return this.prisma.referralCode.create({
            data: { customerId, code },
        });
    }
    async getCode(customerId) {
        return this.prisma.referralCode.findUnique({
            where: { customerId },
        });
    }
    async processReferral(code, referredId, merchantId) {
        const referralCode = await this.prisma.referralCode.findUnique({
            where: { code },
        });
        if (!referralCode)
            throw new common_1.NotFoundException('Invalid referral code');
        if (referralCode.customerId === referredId) {
            throw new common_1.BadRequestException('Cannot refer yourself');
        }
        const existing = await this.prisma.referral.findFirst({
            where: { referralCodeId: referralCode.id, referredId },
        });
        if (existing)
            throw new common_1.BadRequestException('Already referred by this code');
        const referredMembership = await this.prisma.membership.findUnique({
            where: { customerId_merchantId: { customerId: referredId, merchantId } },
        });
        if (!referredMembership)
            throw new common_1.NotFoundException('Referred customer has no membership');
        const referrerMembership = await this.prisma.membership.findUnique({
            where: { customerId_merchantId: { customerId: referralCode.customerId, merchantId } },
        });
        const rewardPoints = 100;
        const referral = await this.prisma.referral.create({
            data: {
                referralCodeId: referralCode.id,
                referredId,
                merchantId,
                rewardPoints,
                rewardGiven: false,
            },
        });
        if (referrerMembership) {
            await this.prisma.membership.update({
                where: { id: referrerMembership.id },
                data: { points: { increment: rewardPoints } },
            });
            await this.prisma.referral.update({
                where: { id: referral.id },
                data: { rewardGiven: true },
            });
        }
        await this.prisma.referralCode.update({
            where: { id: referralCode.id },
            data: { usedCount: { increment: 1 } },
        });
        if (referredMembership) {
            const bonusPoints = 50;
            await this.prisma.membership.update({
                where: { id: referredMembership.id },
                data: { points: { increment: bonusPoints } },
            });
        }
        this.logger.log(`Referral processed: code=${code} referred=${referredId} merchant=${merchantId}`);
        return referral;
    }
    async getReferralStats(customerId, merchantId) {
        const referralCode = await this.prisma.referralCode.findUnique({
            where: { customerId },
        });
        if (!referralCode) {
            return { totalReferrals: 0, totalPointsEarned: 0, referrals: [] };
        }
        const referrals = await this.prisma.referral.findMany({
            where: { referralCodeId: referralCode.id, merchantId },
            include: { referred: true },
            orderBy: { createdAt: 'desc' },
        });
        const totalPointsEarned = referrals
            .filter((r) => r.rewardGiven)
            .reduce((sum, r) => sum + r.rewardPoints, 0);
        return {
            totalReferrals: referrals.length,
            totalPointsEarned,
            referrals,
        };
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = ReferralsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map