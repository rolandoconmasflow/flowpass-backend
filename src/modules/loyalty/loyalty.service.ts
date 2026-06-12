import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, CreateRewardDto, UpdateRewardDto } from '../../dtos/loyalty.dto';

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  async createProgram(data: CreateLoyaltyProgramDto) {
    return this.prisma.loyaltyProgram.create({ data });
  }

  async getAllPrograms() {
    return this.prisma.loyaltyProgram.findMany({
      include: { merchant: true, rewards: true },
    });
  }

  async getProgramById(id: string) {
    const program = await this.prisma.loyaltyProgram.findUnique({
      where: { id },
      include: { merchant: true, rewards: true, memberships: true },
    });
    if (!program) throw new NotFoundException('Loyalty program not found');
    return program;
  }

  async getProgramsByMerchant(merchantId: string) {
    return this.prisma.loyaltyProgram.findMany({
      where: { merchantId },
      include: { rewards: true },
    });
  }

  async updateProgram(id: string, data: UpdateLoyaltyProgramDto) {
    const program = await this.prisma.loyaltyProgram.findUnique({ where: { id } });
    if (!program) throw new NotFoundException('Loyalty program not found');
    return this.prisma.loyaltyProgram.update({ where: { id }, data });
  }

  async deleteProgram(id: string) {
    const program = await this.prisma.loyaltyProgram.findUnique({ where: { id } });
    if (!program) throw new NotFoundException('Loyalty program not found');
    return this.prisma.loyaltyProgram.delete({ where: { id } });
  }

  async createReward(data: CreateRewardDto) {
    return this.prisma.reward.create({ data });
  }

  async getAllRewards() {
    return this.prisma.reward.findMany({
      include: { merchant: true, loyaltyProgram: true },
    });
  }

  async getRewardById(id: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
      include: { merchant: true, loyaltyProgram: true, redemptions: true },
    });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  async getRewardsByMerchant(merchantId: string) {
    return this.prisma.reward.findMany({
      where: { merchantId },
      include: { loyaltyProgram: true },
    });
  }

  async updateReward(id: string, data: UpdateRewardDto) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return this.prisma.reward.update({ where: { id }, data });
  }

  async deleteReward(id: string) {
    const reward = await this.prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return this.prisma.reward.delete({ where: { id } });
  }
}
