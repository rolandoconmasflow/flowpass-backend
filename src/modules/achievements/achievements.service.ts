import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAchievementDto) {
    return this.prisma.achievement.create({ data: data as any });
  }

  async findByMerchant(merchantId: string) {
    return this.prisma.achievement.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      include: { earnedBy: { include: { customer: true } } },
    });
    if (!achievement) throw new NotFoundException('Achievement not found');
    return achievement;
  }

  async update(id: string, data: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.findUnique({ where: { id } });
    if (!achievement) throw new NotFoundException('Achievement not found');
    return this.prisma.achievement.update({ where: { id }, data: data as any });
  }

  async delete(id: string) {
    const achievement = await this.prisma.achievement.findUnique({ where: { id } });
    if (!achievement) throw new NotFoundException('Achievement not found');
    return this.prisma.achievement.delete({ where: { id } });
  }

  async awardAchievement(customerId: string, achievementId: string) {
    const achievement = await this.prisma.achievement.findUnique({ where: { id: achievementId } });
    if (!achievement) throw new NotFoundException('Achievement not found');

    const existing = await this.prisma.customerAchievement.findUnique({
      where: { customerId_achievementId: { customerId, achievementId } },
    });
    if (existing) return existing;

    const earned = await this.prisma.customerAchievement.create({
      data: { customerId, achievementId },
    });

    if (achievement.points > 0) {
      const membership = await this.prisma.membership.findFirst({
        where: { customerId, merchantId: achievement.merchantId },
      });
      if (membership) {
        await this.prisma.membership.update({
          where: { id: membership.id },
          data: { points: { increment: achievement.points } },
        });
      }
    }

    return earned;
  }

  async getCustomerAchievements(customerId: string) {
    return this.prisma.customerAchievement.findMany({
      where: { customerId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async evaluateAndAward(customerId: string, merchantId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { customerId_merchantId: { customerId, merchantId } },
    });
    if (!membership) return [];

    const achievements = await this.prisma.achievement.findMany({
      where: { merchantId },
    });

    const awarded: string[] = [];

    for (const achievement of achievements) {
      const existing = await this.prisma.customerAchievement.findUnique({
        where: { customerId_achievementId: { customerId, achievementId: achievement.id } },
      });
      if (existing) continue;

      const criteria = (achievement.criteria as Record<string, unknown>) || {};
      let meets = true;

      if (typeof criteria.minVisits === 'number' && membership.visitsCount < criteria.minVisits) {
        meets = false;
      }
      if (typeof criteria.minPoints === 'number' && membership.points < criteria.minPoints) {
        meets = false;
      }
      if (typeof criteria.maxVisits === 'number' && membership.visitsCount > criteria.maxVisits) {
        meets = false;
      }

      if (meets) {
        await this.awardAchievement(customerId, achievement.id);
        awarded.push(achievement.name);
      }
    }

    return awarded;
  }
}
