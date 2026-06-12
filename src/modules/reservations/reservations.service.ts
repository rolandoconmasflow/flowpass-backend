import { Injectable, Logger, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  CreateTableDto,
  UpdateTableDto,
  CreateReservationDto,
  UpdateReservationStatusDto,
} from './dto/reservations.dto';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Tables ───────────────────────────────────────────────────

  async getTables(merchantId: string) {
    return this.prisma.table.findMany({
      where: { merchantId },
      orderBy: { label: 'asc' },
      include: {
        reservations: {
          where: {
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
            date: { gte: new Date() },
          },
          select: { id: true, date: true, timeSlot: true, guests: true, status: true, customerName: true },
        },
      },
    });
  }

  async createTable(dto: CreateTableDto) {
    return this.prisma.table.create({ data: dto });
  }

  async updateTable(id: string, dto: UpdateTableDto) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');
    return this.prisma.table.update({ where: { id }, data: dto });
  }

  async deleteTable(id: string) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');
    return this.prisma.table.delete({ where: { id } });
  }

  // ─── Reservations ─────────────────────────────────────────────

  async getMerchantReservations(merchantId: string, date?: string) {
    const where: Prisma.ReservationWhereInput = { merchantId };
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      where.date = { gte: dayStart, lte: dayEnd };
    }
    return this.prisma.reservation.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { table: { select: { id: true, label: true } } },
    });
  }

  async getMyReservations(customerId: string) {
    return this.prisma.reservation.findMany({
      where: { customerId },
      orderBy: { date: 'desc' },
      include: {
        merchant: { select: { id: true, name: true, slug: true, logoUrl: true } },
        table: { select: { id: true, label: true } },
      },
    });
  }

  async getAvailableSlots(merchantId: string, date: string) {
    const tables = await this.prisma.table.findMany({
      where: { merchantId, isActive: true },
      include: {
        reservations: {
          where: {
            date: new Date(date),
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
          },
        },
      },
    });

    const slots = [
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30',
      '21:00',
      '21:30',
      '22:00',
      '22:30',
      '23:00',
      '23:30',
    ];

    const available: Record<string, { tableId: string; label: string; capacity: number }[]> = {};

    for (const table of tables) {
      const bookedSlots = table.reservations.map((r) => r.timeSlot);
      for (const slot of slots) {
        if (!bookedSlots.includes(slot)) {
          if (!available[slot]) available[slot] = [];
          available[slot].push({ tableId: table.id, label: table.label, capacity: table.capacity });
        }
      }
    }

    return available;
  }

  async createReservation(dto: CreateReservationDto, customerId: string) {
    if (dto.customerId !== customerId) {
      throw new ForbiddenException('Cannot create reservation for another user');
    }

    if (dto.tableId) {
      const existing = await this.prisma.reservation.findFirst({
        where: {
          tableId: dto.tableId,
          date: new Date(dto.date),
          timeSlot: dto.timeSlot,
          status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
        },
      });
      if (existing) throw new ConflictException('Table already booked for this time slot');
    }

    return this.prisma.reservation.create({
      data: {
        merchantId: dto.merchantId,
        customerId: dto.customerId,
        tableId: dto.tableId,
        date: new Date(dto.date),
        timeSlot: dto.timeSlot,
        guests: dto.guests,
        notes: dto.notes,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
      },
      include: { table: { select: { id: true, label: true } } },
    });
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');

    return this.prisma.reservation.update({
      where: { id },
      data: { status: dto.status },
      include: { table: { select: { id: true, label: true } } },
    });
  }

  async cancelMyReservation(id: string, customerId: string) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.customerId !== customerId) throw new ForbiddenException('Not your reservation');

    return this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });
  }
}
