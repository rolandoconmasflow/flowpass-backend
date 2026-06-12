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
var PosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let PosService = PosService_1 = class PosService {
    prisma;
    logger = new common_1.Logger(PosService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkInCustomer(merchantId, locationId, customerPhone) {
        const user = await this.prisma.user.findUnique({
            where: { phone: customerPhone },
            include: { customerProfile: true },
        });
        if (!user?.customerProfile)
            throw new common_1.NotFoundException('Customer not found');
        const customerId = user.customerProfile.id;
        const membership = await this.prisma.membership.upsert({
            where: { customerId_merchantId: { customerId, merchantId } },
            create: {
                customerId,
                merchantId,
                points: 1,
                visitsCount: 1,
                level: 'BRONZE',
            },
            update: {
                points: { increment: 1 },
                visitsCount: { increment: 1 },
            },
        });
        const visit = await this.prisma.visit.create({
            data: {
                membershipId: membership.id,
                merchantId,
                locationId,
                customerId,
                source: 'MANUAL',
            },
        });
        this.logger.log(`POS check-in: customer=${customerId} merchant=${merchantId}`);
        return { visit, membership };
    }
    async redeemCoupon(merchantId, couponCode, channel = 'IN_STORE') {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: couponCode },
            include: { promotion: true },
        });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        if (coupon.status !== 'CLAIMED')
            throw new common_1.BadRequestException('Coupon already used or expired');
        if (coupon.merchantId !== merchantId) {
            throw new common_1.BadRequestException('Coupon not valid for this merchant');
        }
        return this.prisma.coupon.update({
            where: { id: coupon.id },
            data: {
                status: 'REDEEMED',
                redeemedAt: new Date(),
                redemptionChannel: channel,
            },
        });
    }
    async redeemReward(merchantId, customerId, rewardId) {
        const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        if (reward.merchantId !== merchantId)
            throw new common_1.BadRequestException('Reward not for this merchant');
        const membership = await this.prisma.membership.findUnique({
            where: { customerId_merchantId: { customerId, merchantId } },
        });
        if (!membership)
            throw new common_1.NotFoundException('No membership found');
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
                merchantId,
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
        return redemption;
    }
    async lookupCustomer(merchantId, query) {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { phone: { contains: query } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: {
                customerProfile: {
                    include: {
                        memberships: { where: { merchantId } },
                    },
                },
            },
            take: 20,
        });
        return users
            .filter((u) => u.customerProfile)
            .map((u) => ({
            id: u.customerProfile.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            membership: u.customerProfile.memberships[0] || null,
        }));
    }
};
exports.PosService = PosService;
exports.PosService = PosService = PosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PosService);
//# sourceMappingURL=pos.service.js.map