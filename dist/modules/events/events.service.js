"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const paginated_dto_1 = require("../../dtos/paginated.dto");
const crypto = require("crypto");
const QRCode = require("qrcode");
let EventsService = EventsService_1 = class EventsService {
    prisma;
    logger = new common_1.Logger(EventsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCustomerProfile(userId) {
        return this.prisma.customerProfile.findUnique({ where: { userId } });
    }
    async create(dto) {
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
    async findByMerchant(merchantId, query) {
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
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findById(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                merchant: true,
                location: true,
                _count: { select: { tickets: true } },
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return event;
    }
    async update(id, dto) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const data = { ...dto };
        if (dto.saleStartsAt)
            data.saleStartsAt = new Date(dto.saleStartsAt);
        if (dto.saleEndsAt)
            data.saleEndsAt = new Date(dto.saleEndsAt);
        if (dto.startsAt)
            data.startsAt = new Date(dto.startsAt);
        if (dto.endsAt)
            data.endsAt = new Date(dto.endsAt);
        if (dto.capacity !== undefined) {
            data.availableSeats = dto.capacity - (event.capacity - event.availableSeats);
        }
        return this.prisma.event.update({
            where: { id },
            data,
            include: { merchant: true, location: true },
        });
    }
    async delete(id) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return this.prisma.event.delete({ where: { id } });
    }
    async listPublicEvents(query) {
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
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getMyTickets(customerId) {
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
    async purchaseTicket(customerId, dto) {
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
            include: { merchant: true },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (!event.isActive)
            throw new common_1.BadRequestException('Event is not active');
        const now = new Date();
        if (event.saleStartsAt && event.saleStartsAt > now) {
            throw new common_1.BadRequestException('Ticket sales have not started yet');
        }
        if (event.saleEndsAt && event.saleEndsAt < now) {
            throw new common_1.BadRequestException('Ticket sales have ended');
        }
        if (event.availableSeats <= 0) {
            throw new common_1.ConflictException('No available seats for this event');
        }
        const price = Number(event.ticketPrice);
        const commissionRate = event.merchant.commissionRate ?? 5.0;
        const commissionAmount = price * (commissionRate / 100);
        const code = `TKT-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
        const qrDataUrl = await QRCode.toDataURL(code);
        const result = await this.prisma.$transaction(async (tx) => {
            const currentEvent = await tx.event.findUnique({ where: { id: event.id } });
            if (!currentEvent || currentEvent.availableSeats <= 0) {
                throw new common_1.ConflictException('No available seats');
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
    async getEventTickets(eventId, query) {
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
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async validateTicket(code, staffUserId) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { code },
            include: {
                event: {
                    include: { merchant: { include: { staff: true } } },
                },
                customer: { include: { user: true } },
            },
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        const isStaff = ticket.event.merchant.staff.some((s) => s.userId === staffUserId);
        const isOwner = ticket.event.merchant.ownerId === staffUserId;
        if (!isStaff && !isOwner) {
            throw new common_1.BadRequestException('You are not authorized to validate tickets for this event');
        }
        if (ticket.status === 'USED') {
            throw new common_1.BadRequestException('Ticket has already been used');
        }
        if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') {
            throw new common_1.BadRequestException('Ticket is no longer valid');
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
    async getEventDashboard(eventId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                _count: { select: { tickets: true } },
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
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
    async getMerchantEventsDashboard(merchantId) {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map