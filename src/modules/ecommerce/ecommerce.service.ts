import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EcommerceService {
  private readonly logger = new Logger(EcommerceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getPublicMerchant(slug: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { slug },
      include: {
        locations: true,
        loyaltyPrograms: { where: { isActive: true } },
        promotions: {
          where: { isActive: true, claimEndsAt: { gte: new Date() } },
        },
      },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async getPublicRewards(slug: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');

    return this.prisma.reward.findMany({
      where: { merchantId: merchant.id, isActive: true },
      orderBy: { requiredPoints: 'asc' },
    });
  }

  async claimPromotion(slug: string, promotionId: string, customerId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');

    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
    });
    if (!promotion || promotion.merchantId !== merchant.id) {
      throw new NotFoundException('Promotion not found');
    }
    if (!promotion.isActive) {
      throw new NotFoundException('Promotion is not active');
    }

    const existing = await this.prisma.coupon.count({
      where: { promotionId, customerId },
    });
    if (promotion.maxClaimsPerCustomer && existing >= promotion.maxClaimsPerCustomer) {
      throw new NotFoundException('Max claims reached');
    }

    const total = await this.prisma.coupon.count({ where: { promotionId } });
    if (promotion.maxClaims && total >= promotion.maxClaims) {
      throw new NotFoundException('Promotion fully claimed');
    }

    const code = `CPN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const coupon = await this.prisma.coupon.create({
      data: {
        promotionId,
        customerId,
        merchantId: merchant.id,
        code,
        expiresAt: promotion.validTo,
      },
    });

    return coupon;
  }
}
