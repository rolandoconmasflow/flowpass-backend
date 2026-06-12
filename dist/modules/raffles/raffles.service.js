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
var RafflesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RafflesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let RafflesService = RafflesService_1 = class RafflesService {
    prisma;
    logger = new common_1.Logger(RafflesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.raffle.create({ data });
    }
    async findByMerchant(merchantId) {
        return this.prisma.raffle.findMany({
            where: { merchantId },
            include: { _count: { select: { entries: true, winners: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const raffle = await this.prisma.raffle.findUnique({
            where: { id },
            include: { entries: { include: { customer: true } }, winners: { include: { customer: true } } },
        });
        if (!raffle)
            throw new common_1.NotFoundException('Raffle not found');
        return raffle;
    }
    async update(id, data) {
        const raffle = await this.prisma.raffle.findUnique({ where: { id } });
        if (!raffle)
            throw new common_1.NotFoundException('Raffle not found');
        return this.prisma.raffle.update({ where: { id }, data });
    }
    async delete(id) {
        const raffle = await this.prisma.raffle.findUnique({ where: { id } });
        if (!raffle)
            throw new common_1.NotFoundException('Raffle not found');
        return this.prisma.raffle.delete({ where: { id } });
    }
    async enterRaffle(raffleId, customerId) {
        const raffle = await this.prisma.raffle.findUnique({ where: { id: raffleId } });
        if (!raffle)
            throw new common_1.NotFoundException('Raffle not found');
        if (!raffle.isActive)
            throw new common_1.BadRequestException('Raffle is not active');
        if (raffle.endsAt && raffle.endsAt < new Date()) {
            throw new common_1.BadRequestException('Raffle has ended');
        }
        const membership = await this.prisma.membership.findFirst({
            where: { customerId, merchantId: raffle.merchantId },
        });
        if (!membership)
            throw new common_1.BadRequestException('No membership for this merchant');
        if (raffle.entryCost > 0 && membership.points < raffle.entryCost) {
            throw new common_1.BadRequestException('Not enough points');
        }
        const existing = await this.prisma.raffleEntry.findUnique({
            where: { raffleId_customerId: { raffleId, customerId } },
        });
        if (existing)
            throw new common_1.BadRequestException('Already entered this raffle');
        if (raffle.maxEntries) {
            const count = await this.prisma.raffleEntry.count({ where: { raffleId } });
            if (count >= raffle.maxEntries)
                throw new common_1.BadRequestException('Raffle is full');
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
    async drawWinners(raffleId, count = 1) {
        const raffle = await this.prisma.raffle.findUnique({ where: { id: raffleId } });
        if (!raffle)
            throw new common_1.NotFoundException('Raffle not found');
        if (raffle.drawnAt)
            throw new common_1.BadRequestException('Winners already drawn');
        const entries = await this.prisma.raffleEntry.findMany({
            where: { raffleId },
        });
        if (entries.length === 0)
            throw new common_1.BadRequestException('No entries to draw from');
        const pool = [];
        for (const entry of entries) {
            for (let i = 0; i < entry.entries; i++) {
                pool.push(entry.customerId);
            }
        }
        const selected = new Set();
        const winners = [];
        for (let pos = 1; pos <= count && selected.size < pool.length; pos++) {
            let picked;
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
    async getActiveRafflesForCustomer(customerId) {
        const customer = await this.prisma.customerProfile.findUnique({
            where: { id: customerId },
            select: { memberships: { select: { merchantId: true } } },
        });
        if (!customer)
            return [];
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
};
exports.RafflesService = RafflesService;
exports.RafflesService = RafflesService = RafflesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RafflesService);
//# sourceMappingURL=raffles.service.js.map