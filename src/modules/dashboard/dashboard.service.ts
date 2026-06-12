import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMerchantDashboard(merchantId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      activeMemberships,
      totalVisits,
      recentVisits,
      totalCoupons,
      redeemedCoupons,
      totalPoints,
      recentMemberships,
      topCustomers,
    ] = await Promise.all([
      this.prisma.membership.count({ where: { merchantId, status: 'ACTIVE' } }),
      this.prisma.visit.count({ where: { merchantId } }),
      this.prisma.visit.count({ where: { merchantId, createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.coupon.count({ where: { merchantId } }),
      this.prisma.coupon.count({ where: { merchantId, status: 'REDEEMED' } }),
      this.prisma.membership.aggregate({ where: { merchantId }, _sum: { points: true } }),
      this.prisma.membership.count({ where: { merchantId, joinedAt: { gte: thirtyDaysAgo } } }),
      this.prisma.membership.findMany({
        where: { merchantId },
        orderBy: { points: 'desc' },
        take: 5,
        include: { customer: { include: { user: { select: { name: true, email: true } } } } },
      }),
    ]);

    const redemptionRate = totalCoupons > 0 ? Math.round((redeemedCoupons / totalCoupons) * 100) : 0;

    return {
      overview: {
        activeMemberships,
        totalVisits,
        recentVisits,
        totalCoupons,
        redeemedCoupons,
        redemptionRate,
        totalPointsIssued: totalPoints._sum.points || 0,
        newMemberships: recentMemberships,
      },
      topCustomers: topCustomers.map((m) => ({
        name: m.customer.user.name || 'Anónimo',
        email: m.customer.user.email,
        points: m.points,
        visits: m.visitsCount,
        level: m.level,
      })),
    };
  }

  async getAdminDashboard() {
    const [merchants, customers, visits, coupons, activeMemberships] = await Promise.all([
      this.prisma.merchant.count(),
      this.prisma.customerProfile.count(),
      this.prisma.visit.count(),
      this.prisma.coupon.count(),
      this.prisma.membership.count({ where: { status: 'ACTIVE' } }),
    ]);

    const recentMerchants = await this.prisma.merchant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, slug: true, createdAt: true },
    });

    return {
      stats: { merchants, customers, visits, coupons, activeMemberships },
      recentMerchants,
    };
  }
}
