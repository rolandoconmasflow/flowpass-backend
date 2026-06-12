import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdvancedAnalyticsService {
  private readonly logger = new Logger(AdvancedAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRetentionRate(merchantId: string, days = 90) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalCustomers, customersWithVisit] = await Promise.all([
      this.prisma.membership.count({ where: { merchantId } }),
      this.prisma.membership.count({
        where: {
          merchantId,
          visits: { some: { createdAt: { gte: since } } },
        },
      }),
    ]);

    return {
      period: `${days}d`,
      totalCustomers,
      retained: customersWithVisit,
      retentionRate: totalCustomers > 0 ? Math.round((customersWithVisit / totalCustomers) * 100) : 0,
    };
  }

  async getCohortAnalysis(merchantId: string) {
    const rows = await this.prisma.$queryRaw<Array<{ month: string; total: bigint; retained: bigint }>>`
      WITH cohorts AS (
        SELECT
          to_char("joinedAt", 'YYYY-MM') AS month,
          id
        FROM "Membership"
        WHERE "merchantId" = ${merchantId}
      ),
      retained AS (
        SELECT DISTINCT c.month, c.id
        FROM cohorts c
        JOIN "Visit" v ON v."membershipId" = c.id
          AND v."createdAt" >= c."joinedAt" + INTERVAL '7 days'
      )
      SELECT
        c.month,
        COUNT(DISTINCT c.id)::bigint AS total,
        COUNT(DISTINCT r.id)::bigint AS retained
      FROM cohorts c
      LEFT JOIN retained r ON r.id = c.id
      GROUP BY c.month
      ORDER BY c.month
    `;

    return rows.map((r) => ({
      month: r.month,
      total: Number(r.total),
      retained: Number(r.retained),
      retentionRate: Number(r.total) > 0 ? Math.round((Number(r.retained) / Number(r.total)) * 100) : 0,
    }));
  }

  async getPointsEconomics(merchantId: string) {
    const [totalVisits, totalRedemptions, pointsAgg] = await Promise.all([
      this.prisma.visit.count({ where: { merchantId } }),
      this.prisma.rewardRedemption.count({ where: { merchantId } }),
      this.prisma.membership.aggregate({
        where: { merchantId },
        _sum: { points: true },
        _count: true,
      }),
    ]);

    const totalPoints = pointsAgg._sum.points ?? 0;
    const totalCustomers = pointsAgg._count;

    return {
      totalVisits,
      totalRedemptions,
      totalPointsInCirculation: totalPoints,
      avgPointsPerCustomer: totalCustomers > 0 ? Math.round(totalPoints / totalCustomers) : 0,
    };
  }

  async getDashboard(merchantId: string) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [retention, economics, activeMemberships, recentVisits] = await Promise.all([
      this.getRetentionRate(merchantId),
      this.getPointsEconomics(merchantId),
      this.prisma.membership.count({ where: { merchantId, status: 'ACTIVE' } }),
      this.prisma.visit.count({ where: { merchantId, createdAt: { gte: sevenDaysAgo } } }),
    ]);

    return {
      activeMemberships,
      recentVisits,
      retention,
      economics,
    };
  }
}
