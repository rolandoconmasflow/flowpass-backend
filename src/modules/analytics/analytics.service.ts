import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { ownedMerchants: true },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const merchantIds = user.ownedMerchants.map((m) => m.id);

    const [
      totalMerchants,
      totalMemberships,
      totalVisits,
      totalPromotions,
      totalCoupons,
      activeCoupons,
      recentVisits,
    ] = await Promise.all([
      isSuperAdmin
        ? this.prisma.merchant.count()
        : this.prisma.merchant.count({ where: { ownerId: userId } }),

      merchantIds.length > 0
        ? this.prisma.membership.count({ where: { merchantId: { in: merchantIds } } })
        : Promise.resolve(0),

      merchantIds.length > 0
        ? this.prisma.visit.count({ where: { merchantId: { in: merchantIds } } })
        : Promise.resolve(0),

      merchantIds.length > 0
        ? this.prisma.promotion.count({ where: { merchantId: { in: merchantIds } } })
        : Promise.resolve(0),

      merchantIds.length > 0
        ? this.prisma.coupon.count({ where: { merchantId: { in: merchantIds } } })
        : Promise.resolve(0),

      merchantIds.length > 0
        ? this.prisma.coupon.count({
            where: { merchantId: { in: merchantIds }, status: 'CLAIMED' },
          })
        : Promise.resolve(0),

      merchantIds.length > 0
        ? this.prisma.visit.findMany({
            where: { merchantId: { in: merchantIds } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              customer: { select: { displayName: true } },
              merchant: { select: { name: true } },
            },
          })
        : Promise.resolve([]),
    ]);

    return {
      totalMerchants,
      totalMemberships,
      totalVisits,
      totalPromotions,
      totalCoupons,
      activeCoupons,
      recentVisits,
      role: user.role,
    };
  }
}
