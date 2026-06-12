import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCustomers(merchantId: string, filters: {
    minPoints?: number;
    maxPoints?: number;
    minVisits?: number;
    level?: string;
    status?: string;
    joinedAfter?: string;
    joinedBefore?: string;
  } = {}) {
    const where: any = { merchantId };

    if (filters.minPoints) where.points = { ...where.points, gte: filters.minPoints };
    if (filters.maxPoints) where.points = { ...where.points, lte: filters.maxPoints };
    if (filters.minVisits) where.visitsCount = { gte: filters.minVisits };
    if (filters.level) where.level = filters.level;
    if (filters.status) where.status = filters.status;
    if (filters.joinedAfter) where.joinedAt = { ...where.joinedAt, gte: new Date(filters.joinedAfter) };
    if (filters.joinedBefore) where.joinedAt = { ...where.joinedAt, lte: new Date(filters.joinedBefore) };

    const memberships = await this.prisma.membership.findMany({
      where,
      include: {
        customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
        _count: { select: { visits: true, coupons: true } },
      },
      orderBy: { points: 'desc' },
    });

    return memberships;
  }

  async getSegments(merchantId: string) {
    const total = await this.prisma.membership.count({ where: { merchantId } });

    const byLevel = await this.prisma.membership.groupBy({
      by: ['level'],
      where: { merchantId },
      _count: true,
    });

    const byStatus = await this.prisma.membership.groupBy({
      by: ['status'],
      where: { merchantId },
      _count: true,
    });

    const highValue = await this.prisma.membership.count({
      where: { merchantId, points: { gte: 500 }, visitsCount: { gte: 10 } },
    });

    const atRisk = await this.prisma.membership.count({
      where: { merchantId, visitsCount: 0, joinedAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    });

    return {
      total,
      byLevel,
      byStatus,
      segments: {
        highValue,
        atRisk,
        active: total - atRisk,
      },
    };
  }

  async getCustomerTimeline(customerId: string, merchantId: string) {
    const [visits, redemptions, coupons] = await Promise.all([
      this.prisma.visit.findMany({
        where: { customerId, merchantId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.rewardRedemption.findMany({
        where: { customerId, merchantId },
        include: { reward: true },
        orderBy: { redeemedAt: 'desc' },
        take: 50,
      }),
      this.prisma.coupon.findMany({
        where: { customerId, merchantId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { promotion: true },
      }),
    ]);

    return { visits, redemptions, coupons };
  }
}
