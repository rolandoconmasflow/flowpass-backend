import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMissionDto, UpdateMissionDto } from './dto/mission.dto';

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMissionDto) {
    return this.prisma.mission.create({ data });
  }

  async findByMerchant(merchantId: string) {
    return this.prisma.mission.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id },
      include: { customerMissions: true },
    });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async update(id: string, data: UpdateMissionDto) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    return this.prisma.mission.update({ where: { id }, data });
  }

  async delete(id: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new NotFoundException('Mission not found');
    return this.prisma.mission.delete({ where: { id } });
  }

  async getCustomerMissions(customerId: string) {
    return this.prisma.customerMission.findMany({
      where: { customerId },
      include: { mission: true },
      orderBy: { mission: { createdAt: 'desc' } },
    });
  }

  async trackProgress(customerId: string, missionId: string, increment = 1) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission not found');

    const existing = await this.prisma.customerMission.upsert({
      where: { customerId_missionId: { customerId, missionId } },
      create: { customerId, missionId, progress: increment },
      update: { progress: { increment } },
    });

    if (!existing.completed && existing.progress >= mission.goalValue) {
      const completed = await this.prisma.customerMission.update({
        where: { id: existing.id },
        data: { completed: true, completedAt: new Date() },
      });

      if (mission.rewardPoints > 0) {
        const membership = await this.prisma.membership.findFirst({
          where: { customerId, merchantId: mission.merchantId },
        });
        if (membership) {
          await this.prisma.membership.update({
            where: { id: membership.id },
            data: { points: { increment: mission.rewardPoints } },
          });
        }
      }

      this.logger.log(`Mission completed: customer=${customerId} mission=${missionId}`);
      return completed;
    }

    return existing;
  }

  async getActiveMissionsForCustomer(customerId: string) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerId },
      select: { memberships: { select: { merchantId: true } } },
    });
    if (!customer) return [];

    const merchantIds = customer.memberships.map((m) => m.merchantId);

    const missions = await this.prisma.mission.findMany({
      where: {
        merchantId: { in: merchantIds },
        isActive: true,
        OR: [
          { endsAt: null },
          { endsAt: { gte: new Date() } },
        ],
      },
      include: {
        customerMissions: { where: { customerId } },
      },
    });

    return missions.map((m) => ({
      ...m,
      customerProgress: m.customerMissions[0] || null,
      customerMissions: undefined,
    }));
  }
}
