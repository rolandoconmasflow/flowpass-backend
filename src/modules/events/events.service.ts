import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto, UpdateEventDto, PurchaseTicketDto } from './dto/event.dto';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findCustomerProfile(userId: string) {
    return this.prisma.customerProfile.findUnique({ where: { userId } });
  }

  // ─── CRUD de Eventos ───────────────────────────────────────────

  async create(dto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        merchantId: dto.merchantId,
        locationId: dto.locationId,
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        category: dto.category || 'OTHER',
        ticketPrice: dto.ticketPrice || 0,
        capacity: dto.capacity || 0,
        availableSeats: dto.capacity || 0,
        saleStartsAt: dto.saleStartsAt ? new Date(dto.saleStartsAt) : null,
        saleEndsAt: dto.saleEndsAt ? new Date(dto.saleEndsAt) : null,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      },
      include: { merchant: true, location: true },
    });
    return event;
  }

  async findByMerchant(merchantId: string, query?: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where = { merchantId };
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { startsAt: 'desc' },
        skip,
        take: limit,
        include: { location: true, _count: { select: { tickets: true } } },
      }),
      this.prisma.event.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        merchant: true,
        location: true,
        _count: { select: { tickets: true } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    const data = { ...dto } as Prisma.EventUncheckedUpdateInput;
    if (dto.saleStartsAt) data.saleStartsAt = new Date(dto.saleStartsAt);
    if (dto.saleEndsAt) data.saleEndsAt = new Date(dto.saleEndsAt);
    if (dto.startsAt) data.startsAt = new Date(dto.startsAt);
    if (dto.endsAt) data.endsAt = new Date(dto.endsAt);
    if (dto.capacity !== undefined) {
      data.availableSeats = dto.capacity - (event.capacity - event.availableSeats);
    }

    return this.prisma.event.update({
      where: { id },
      data,
      include: { merchant: true, location: true },
    });
  }

  async delete(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return this.prisma.event.delete({ where: { id } });
  }

  // ─── Eventos públicos (para mobile) ────────────────────────────

  async listPublicEvents(query?: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;
    const now = new Date();
    const where = {
      isActive: true,
      saleStartsAt: { lte: now },
      saleEndsAt: { gte: now },
      availableSeats: { gt: 0 },
    };
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { startsAt: 'asc' },
        skip,
        take: limit,
        include: { merchant: { select: { name: true, logoUrl: true } }, location: true },
      }),
      this.prisma.event.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async getMyTickets(customerId: string) {
    return this.prisma.ticket.findMany({
      where: { customerId },
      orderBy: { purchaseDate: 'desc' },
      include: {
        event: {
          include: {
            merchant: { select: { name: true, logoUrl: true } },
            location: true,
          },
        },
      },
    });
  }

  // ─── Compra de tickets ─────────────────────────────────────────

  async purchaseTicket(customerId: string, dto: PurchaseTicketDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { merchant: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (!event.isActive) throw new BadRequestException('Event is not active');

    const now = new Date();
    if (event.saleStartsAt && event.saleStartsAt > now) {
      throw new BadRequestException('Ticket sales have not started yet');
    }
    if (event.saleEndsAt && event.saleEndsAt < now) {
      throw new BadRequestException('Ticket sales have ended');
    }
    if (event.availableSeats <= 0) {
      throw new ConflictException('No available seats for this event');
    }

    const price = Number(event.ticketPrice);
    const commissionRate = event.merchant.commissionRate ?? 5.0;
    const commissionAmount = price * (commissionRate / 100);

    // Generar código QR único
    const code = `TKT-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
    const qrDataUrl = await QRCode.toDataURL(code);

    // Crear ticket y decrementar asientos en transacción
    const result = await this.prisma.$transaction(async (tx) => {
      const currentEvent = await tx.event.findUnique({ where: { id: event.id } });
      if (!currentEvent || currentEvent.availableSeats <= 0) {
        throw new ConflictException('No available seats');
      }

      const ticket = await tx.ticket.create({
        data: {
          eventId: event.id,
          customerId,
          code,
          status: 'PURCHASED',
          paymentAmount: price,
          commissionAmount,
          customerEmail: dto.customerEmail,
        },
      });

      await tx.event.update({
        where: { id: event.id },
        data: { availableSeats: { decrement: 1 } },
      });

      return ticket;
    });

    this.logger.log(`Ticket ${code} purchased for event ${event.title}`);

    return {
      ticket: result,
      qrDataUrl,
      event: {
        title: event.title,
        startsAt: event.startsAt,
        merchant: event.merchant.name,
      },
    };
  }

  // ─── Listado de tickets (staff) ────────────────────────────────

  async getEventTickets(eventId: string, query: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where = { eventId };
    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        orderBy: { purchaseDate: 'desc' },
        skip,
        take: limit,
        include: {
          customer: {
            include: { user: true },
          },
          event: true,
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  // ─── Validación de tickets (staff escanea QR) ──────────────────

  async validateTicket(code: string, staffUserId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
      include: {
        event: {
          include: { merchant: { include: { staff: true } } },
        },
        customer: { include: { user: true } },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Verificar que el staff pertenece al merchant del evento
    const isStaff = ticket.event.merchant.staff.some((s) => s.userId === staffUserId);
    const isOwner = ticket.event.merchant.ownerId === staffUserId;
    if (!isStaff && !isOwner) {
      throw new BadRequestException('You are not authorized to validate tickets for this event');
    }

    if (ticket.status === 'USED') {
      throw new BadRequestException('Ticket has already been used');
    }
    if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') {
      throw new BadRequestException('Ticket is no longer valid');
    }

    const updated = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'USED',
        usedAt: new Date(),
        usedBy: staffUserId,
      },
    });

    this.logger.log(`Ticket ${code} validated by staff ${staffUserId}`);

    return {
      ticket: updated,
      event: ticket.event.title,
      customer: ticket.customer.user.name || ticket.customer.user.email,
      validatedAt: new Date(),
    };
  }

  // ─── Dashboard del evento ──────────────────────────────────────

  async getEventDashboard(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { tickets: true } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');

    const [totalSold, totalUsed, totalCancelled, totalRevenue] = await Promise.all([
      this.prisma.ticket.count({ where: { eventId, status: 'PURCHASED' } }),
      this.prisma.ticket.count({ where: { eventId, status: 'USED' } }),
      this.prisma.ticket.count({ where: { eventId, status: 'CANCELLED' } }),
      this.prisma.ticket.aggregate({
        where: { eventId, status: { in: ['PURCHASED', 'USED'] } },
        _sum: { paymentAmount: true },
      }),
    ]);

    return {
      eventId: event.id,
      title: event.title,
      capacity: event.capacity,
      availableSeats: event.availableSeats,
      totalSold,
      totalUsed,
      totalCancelled,
      totalRevenue: totalRevenue._sum.paymentAmount || 0,
      occupancyRate: event.capacity > 0 ? Math.round((totalSold / event.capacity) * 100) : 0,
    };
  }

  async getMerchantEventsDashboard(merchantId: string) {
    const events = await this.prisma.event.findMany({
      where: { merchantId },
      orderBy: { startsAt: 'desc' },
      include: {
        _count: { select: { tickets: true } },
      },
    });

    const totalRevenue = await this.prisma.ticket.aggregate({
      where: {
        event: { merchantId },
        status: { in: ['PURCHASED', 'USED'] },
      },
      _sum: { paymentAmount: true },
    });

    return {
      events,
      totalEvents: events.length,
      totalRevenue: totalRevenue._sum.paymentAmount || 0,
    };
  }
}
