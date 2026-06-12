import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { RedemptionChannel } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PosService {
  private readonly logger = new Logger(PosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkInCustomer(merchantId: string, locationId: string, customerPhone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone: customerPhone },
      include: { customerProfile: true },
    });
    if (!user?.customerProfile) throw new NotFoundException('Customer not found');

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

  async redeemCoupon(merchantId: string, couponCode: string, channel = 'IN_STORE') {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: couponCode },
      include: { promotion: true },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (coupon.status !== 'CLAIMED') throw new BadRequestException('Coupon already used or expired');

    if (coupon.merchantId !== merchantId) {
      throw new BadRequestException('Coupon not valid for this merchant');
    }

    return this.prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        status: 'REDEEMED',
        redeemedAt: new Date(),
        redemptionChannel: channel as RedemptionChannel,
      },
    });
  }

  async redeemReward(merchantId: string, customerId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Reward not found');
    if (reward.merchantId !== merchantId) throw new BadRequestException('Reward not for this merchant');

    const membership = await this.prisma.membership.findUnique({
      where: { customerId_merchantId: { customerId, merchantId } },
    });
    if (!membership) throw new NotFoundException('No membership found');

    if (reward.requiredPoints && membership.points < reward.requiredPoints) {
      throw new BadRequestException('Not enough points');
    }
    if (reward.requiredVisits && membership.visitsCount < reward.requiredVisits) {
      throw new BadRequestException('Not enough visits');
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

  async lookupCustomer(merchantId: string, query: string) {
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
        id: u.customerProfile!.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        membership: u.customerProfile!.memberships[0] || null,
      }));
  }
}
