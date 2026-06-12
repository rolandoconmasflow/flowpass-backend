import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateCode(customerId: string) {
    const existing = await this.prisma.referralCode.findUnique({
      where: { customerId },
    });
    if (existing) return existing;

    const membership = await this.prisma.membership.findFirst({
      where: { customerId },
      select: { merchantId: true },
    });
    if (!membership) throw new BadRequestException('Customer has no membership');

    const raw = `FLOW-${customerId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const code = raw.slice(0, 20);

    return this.prisma.referralCode.create({
      data: { customerId, code },
    });
  }

  async getCode(customerId: string) {
    return this.prisma.referralCode.findUnique({
      where: { customerId },
    });
  }

  async processReferral(code: string, referredId: string, merchantId: string) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
    });
    if (!referralCode) throw new NotFoundException('Invalid referral code');

    if (referralCode.customerId === referredId) {
      throw new BadRequestException('Cannot refer yourself');
    }

    const existing = await this.prisma.referral.findFirst({
      where: { referralCodeId: referralCode.id, referredId },
    });
    if (existing) throw new BadRequestException('Already referred by this code');

    const referredMembership = await this.prisma.membership.findUnique({
      where: { customerId_merchantId: { customerId: referredId, merchantId } },
    });
    if (!referredMembership) throw new NotFoundException('Referred customer has no membership');

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

  async getReferralStats(customerId: string, merchantId: string) {
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
}
