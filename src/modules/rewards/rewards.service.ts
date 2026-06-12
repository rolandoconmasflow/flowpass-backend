import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRewardDto, UpdateRewardDto } from './dto/reward.dto';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRewardDto) {
    return this.prisma.reward.create({ data });
  }

  async findByMerchant(merchantId: string) {
    return this.prisma.reward.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async update(id: string, data: UpdateRewardDto) {
    await this.findById(id);
    return this.prisma.reward.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.reward.delete({ where: { id } });
  }

  async getCustomerCatalog(customerId: string) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerId },
      include: { memberships: true },
    });
    if (!customer) return [];

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
      const membership = customer.memberships.find(
        (m) => m.merchantId === reward.merchantId,
      );
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

  async redeem(rewardId: string, customerId: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Reward not found');
    if (!reward.isActive) throw new BadRequestException('Reward is not active');

    const membership = await this.prisma.membership.findUnique({
      where: { customerId_merchantId: { customerId, merchantId: reward.merchantId } },
    });
    if (!membership) throw new BadRequestException('No membership for this merchant');

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

  async getRedemptionHistory(membershipId: string) {
    return this.prisma.rewardRedemption.findMany({
      where: { membershipId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
  }
}
