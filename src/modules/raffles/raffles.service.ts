import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRaffleDto, UpdateRaffleDto } from './dto/raffle.dto';

@Injectable()
export class RafflesService {
  private readonly logger = new Logger(RafflesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRaffleDto) {
    return this.prisma.raffle.create({ data });
  }

  async findByMerchant(merchantId: string) {
    return this.prisma.raffle.findMany({
      where: { merchantId },
      include: { _count: { select: { entries: true, winners: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id },
      include: { entries: { include: { customer: true } }, winners: { include: { customer: true } } },
    });
    if (!raffle) throw new NotFoundException('Raffle not found');
    return raffle;
  }

  async update(id: string, data: UpdateRaffleDto) {
    const raffle = await this.prisma.raffle.findUnique({ where: { id } });
    if (!raffle) throw new NotFoundException('Raffle not found');
    return this.prisma.raffle.update({ where: { id }, data });
  }

  async delete(id: string) {
    const raffle = await this.prisma.raffle.findUnique({ where: { id } });
    if (!raffle) throw new NotFoundException('Raffle not found');
    return this.prisma.raffle.delete({ where: { id } });
  }

  async enterRaffle(raffleId: string, customerId: string) {
    const raffle = await this.prisma.raffle.findUnique({ where: { id: raffleId } });
    if (!raffle) throw new NotFoundException('Raffle not found');
    if (!raffle.isActive) throw new BadRequestException('Raffle is not active');

    if (raffle.endsAt && raffle.endsAt < new Date()) {
      throw new BadRequestException('Raffle has ended');
    }

    const membership = await this.prisma.membership.findFirst({
      where: { customerId, merchantId: raffle.merchantId },
    });
    if (!membership) throw new BadRequestException('No membership for this merchant');

    if (raffle.entryCost > 0 && membership.points < raffle.entryCost) {
      throw new BadRequestException('Not enough points');
    }

    const existing = await this.prisma.raffleEntry.findUnique({
      where: { raffleId_customerId: { raffleId, customerId } },
    });
    if (existing) throw new BadRequestException('Already entered this raffle');

    if (raffle.maxEntries) {
      const count = await this.prisma.raffleEntry.count({ where: { raffleId } });
      if (count >= raffle.maxEntries) throw new BadRequestException('Raffle is full');
    }

    const entries = 1;

    if (raffle.entryCost > 0) {
      await this.prisma.membership.update({
        where: { id: membership.id },
        data: { points: { decrement: raffle.entryCost * entries } },
      });
    }

    const entry = await this.prisma.raffleEntry.create({
      data: { raffleId, customerId, entries },
    });

    this.logger.log(`Raffle entry: customer=${customerId} raffle=${raffleId}`);

    return entry;
  }

  async drawWinners(raffleId: string, count = 1) {
    const raffle = await this.prisma.raffle.findUnique({ where: { id: raffleId } });
    if (!raffle) throw new NotFoundException('Raffle not found');
    if (raffle.drawnAt) throw new BadRequestException('Winners already drawn');

    const entries = await this.prisma.raffleEntry.findMany({
      where: { raffleId },
    });

    if (entries.length === 0) throw new BadRequestException('No entries to draw from');

    const pool: string[] = [];
    for (const entry of entries) {
      for (let i = 0; i < entry.entries; i++) {
        pool.push(entry.customerId);
      }
    }

    const selected = new Set<string>();
    const winners: { customerId: string; position: number }[] = [];

    for (let pos = 1; pos <= count && selected.size < pool.length; pos++) {
      let picked: string;
      do {
        picked = pool[Math.floor(Math.random() * pool.length)];
      } while (selected.has(picked));
      selected.add(picked);
      winners.push({ customerId: picked, position: pos });
    }

    for (const w of winners) {
      await this.prisma.raffleWinner.create({
        data: { raffleId, customerId: w.customerId, position: w.position },
      });
    }

    await this.prisma.raffle.update({
      where: { id: raffleId },
      data: { drawnAt: new Date() },
    });

    this.logger.log(`Raffle drawn: ${raffleId} winners=${winners.length}`);

    return this.prisma.raffle.findUnique({
      where: { id: raffleId },
      include: { winners: { include: { customer: true } } },
    });
  }

  async getActiveRafflesForCustomer(customerId: string) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerId },
      select: { memberships: { select: { merchantId: true } } },
    });
    if (!customer) return [];

    const merchantIds = customer.memberships.map((m) => m.merchantId);

    const raffles = await this.prisma.raffle.findMany({
      where: {
        merchantId: { in: merchantIds },
        isActive: true,
        drawnAt: null,
        OR: [
          { endsAt: null },
          { endsAt: { gte: new Date() } },
        ],
      },
      include: {
        _count: { select: { entries: true } },
        entries: { where: { customerId }, select: { id: true } },
      },
    });

    return raffles.map((r) => ({
      ...r,
      hasEntered: r.entries.length > 0,
      entries: undefined,
    }));
  }
}
