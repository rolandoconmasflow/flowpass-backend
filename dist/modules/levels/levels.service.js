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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const DEFAULT_LEVELS = [
    {
        name: 'BRONCE',
        minPoints: 0,
        minVisits: 0,
        color: '#CD7F32',
        sortOrder: 0,
        isSystem: true,
        skinType: 'SYSTEM',
        skinConfig: {
            backgroundColor: '#CD7F32',
            textColor: '#FFFFFF',
            borderColor: '#8B5E3C',
            badgeUrl: null,
            backgroundImageUrl: null,
        },
        benefits: {
            pointsPerVisit: 1,
            discountPercent: 0,
            description: 'Nivel inicial. Bienvenido!',
        },
    },
    {
        name: 'PLATA',
        minPoints: 50,
        minVisits: 5,
        color: '#C0C0C0',
        sortOrder: 1,
        isSystem: true,
        skinType: 'SYSTEM',
        skinConfig: {
            backgroundColor: '#C0C0C0',
            textColor: '#1A1A1A',
            borderColor: '#808080',
            badgeUrl: null,
            backgroundImageUrl: null,
        },
        benefits: {
            pointsPerVisit: 2,
            discountPercent: 5,
            description: 'Cliente frecuente. 5% de descuento en cada visita.',
        },
    },
    {
        name: 'ORO',
        minPoints: 150,
        minVisits: 15,
        color: '#FFD700',
        sortOrder: 2,
        isSystem: true,
        skinType: 'SYSTEM',
        skinConfig: {
            backgroundColor: '#FFD700',
            textColor: '#1A1A1A',
            borderColor: '#B8860B',
            badgeUrl: null,
            backgroundImageUrl: null,
        },
        benefits: {
            pointsPerVisit: 3,
            discountPercent: 10,
            description: 'Cliente premium. 10% de descuento + promos exclusivas.',
        },
    },
    {
        name: 'PLATINO',
        minPoints: 300,
        minVisits: 30,
        color: '#1A1A2E',
        sortOrder: 3,
        isSystem: true,
        skinType: 'SYSTEM',
        skinConfig: {
            backgroundColor: '#1A1A2E',
            textColor: '#FFD700',
            borderColor: '#FFD700',
            badgeUrl: null,
            backgroundImageUrl: null,
        },
        benefits: {
            pointsPerVisit: 5,
            discountPercent: 20,
            description: 'Cliente VIP. 20% de descuento + regalo de cumpleaños.',
        },
    },
];
let LevelsService = class LevelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.loyaltyLevel.create({ data: data });
    }
    async findAll() {
        return this.prisma.loyaltyLevel.findMany({ orderBy: { sortOrder: 'asc' } });
    }
    async findByMerchant(merchantId) {
        return this.prisma.loyaltyLevel.findMany({
            where: { merchantId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findById(id) {
        const level = await this.prisma.loyaltyLevel.findUnique({ where: { id } });
        if (!level)
            throw new common_1.NotFoundException('Level not found');
        return level;
    }
    async update(id, data) {
        const level = await this.prisma.loyaltyLevel.findUnique({ where: { id } });
        if (!level)
            throw new common_1.NotFoundException('Level not found');
        return this.prisma.loyaltyLevel.update({ where: { id }, data: data });
    }
    async delete(id) {
        const level = await this.prisma.loyaltyLevel.findUnique({ where: { id } });
        if (!level)
            throw new common_1.NotFoundException('Level not found');
        return this.prisma.loyaltyLevel.delete({ where: { id } });
    }
    async getMembershipLevel(membershipId) {
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
            include: { levelInfo: true },
        });
        if (!membership)
            throw new common_1.NotFoundException('Membership not found');
        return membership.levelInfo || null;
    }
    async enableLevelsForMerchant(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        const existingLevels = await this.prisma.loyaltyLevel.count({ where: { merchantId } });
        if (existingLevels === 0) {
            for (const level of DEFAULT_LEVELS) {
                await this.prisma.loyaltyLevel.create({
                    data: { ...level, merchantId },
                });
            }
        }
        return this.prisma.merchant.update({
            where: { id: merchantId },
            data: { levelsEnabled: true },
        });
    }
    async disableLevelsForMerchant(merchantId) {
        return this.prisma.merchant.update({
            where: { id: merchantId },
            data: { levelsEnabled: false },
        });
    }
    async getMerchantLevelsStatus(merchantId) {
        const merchant = await this.prisma.merchant.findUnique({
            where: { id: merchantId },
            select: { levelsEnabled: true },
        });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        return merchant;
    }
    async evaluateAndUpgrade(membershipId) {
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
            include: { merchant: true },
        });
        if (!membership)
            throw new common_1.NotFoundException('Membership not found');
        if (!membership.merchant.levelsEnabled)
            return null;
        const levels = await this.prisma.loyaltyLevel.findMany({
            where: { merchantId: membership.merchantId, isActive: true },
            orderBy: { sortOrder: 'desc' },
        });
        if (levels.length === 0)
            return null;
        const bestLevel = levels.find((l) => membership.points >= l.minPoints && membership.visitsCount >= l.minVisits);
        if (bestLevel && bestLevel.id !== membership.levelId) {
            await this.prisma.membership.update({
                where: { id: membershipId },
                data: { levelId: bestLevel.id, level: bestLevel.name },
            });
            await this.prisma.walletPass.updateMany({
                where: { membershipId, status: 'ACTIVE' },
                data: { skinVersion: { increment: 1 } },
            });
            return bestLevel;
        }
        return null;
    }
};
exports.LevelsService = LevelsService;
exports.LevelsService = LevelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LevelsService);
//# sourceMappingURL=levels.service.js.map