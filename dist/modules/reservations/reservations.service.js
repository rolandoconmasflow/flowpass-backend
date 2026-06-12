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
var ReservationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let ReservationsService = ReservationsService_1 = class ReservationsService {
    prisma;
    logger = new common_1.Logger(ReservationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTables(merchantId) {
        return this.prisma.table.findMany({
            where: { merchantId },
            orderBy: { label: 'asc' },
            include: {
                reservations: {
                    where: {
                        status: { in: [client_1.ReservationStatus.PENDING, client_1.ReservationStatus.CONFIRMED] },
                        date: { gte: new Date() },
                    },
                    select: { id: true, date: true, timeSlot: true, guests: true, status: true, customerName: true },
                },
            },
        });
    }
    async createTable(dto) {
        return this.prisma.table.create({ data: dto });
    }
    async updateTable(id, dto) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        return this.prisma.table.update({ where: { id }, data: dto });
    }
    async deleteTable(id) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException('Table not found');
        return this.prisma.table.delete({ where: { id } });
    }
    async getMerchantReservations(merchantId, date) {
        const where = { merchantId };
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
    async getMyReservations(customerId) {
        return this.prisma.reservation.findMany({
            where: { customerId },
            orderBy: { date: 'desc' },
            include: {
                merchant: { select: { id: true, name: true, slug: true, logoUrl: true } },
                table: { select: { id: true, label: true } },
            },
        });
    }
    async getAvailableSlots(merchantId, date) {
        const tables = await this.prisma.table.findMany({
            where: { merchantId, isActive: true },
            include: {
                reservations: {
                    where: {
                        date: new Date(date),
                        status: { in: [client_1.ReservationStatus.PENDING, client_1.ReservationStatus.CONFIRMED] },
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
        const available = {};
        for (const table of tables) {
            const bookedSlots = table.reservations.map((r) => r.timeSlot);
            for (const slot of slots) {
                if (!bookedSlots.includes(slot)) {
                    if (!available[slot])
                        available[slot] = [];
                    available[slot].push({ tableId: table.id, label: table.label, capacity: table.capacity });
                }
            }
        }
        return available;
    }
    async createReservation(dto, customerId) {
        if (dto.customerId !== customerId) {
            throw new common_1.ForbiddenException('Cannot create reservation for another user');
        }
        if (dto.tableId) {
            const existing = await this.prisma.reservation.findFirst({
                where: {
                    tableId: dto.tableId,
                    date: new Date(dto.date),
                    timeSlot: dto.timeSlot,
                    status: { in: [client_1.ReservationStatus.PENDING, client_1.ReservationStatus.CONFIRMED] },
                },
            });
            if (existing)
                throw new common_1.ConflictException('Table already booked for this time slot');
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
    async updateStatus(id, dto) {
        const reservation = await this.prisma.reservation.findUnique({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reservation not found');
        return this.prisma.reservation.update({
            where: { id },
            data: { status: dto.status },
            include: { table: { select: { id: true, label: true } } },
        });
    }
    async cancelMyReservation(id, customerId) {
        const reservation = await this.prisma.reservation.findUnique({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reservation not found');
        if (reservation.customerId !== customerId)
            throw new common_1.ForbiddenException('Not your reservation');
        return this.prisma.reservation.update({
            where: { id },
            data: { status: client_1.ReservationStatus.CANCELLED },
        });
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = ReservationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map