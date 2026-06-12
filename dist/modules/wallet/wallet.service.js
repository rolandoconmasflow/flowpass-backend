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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyCards(userId) {
        const customerProfile = await this.prisma.customerProfile.findUnique({
            where: { userId },
        });
        if (!customerProfile) {
            return { passes: [] };
        }
        const memberships = await this.prisma.membership.findMany({
            where: { customerId: customerProfile.id },
            include: {
                merchant: true,
                walletPasses: true,
                levelInfo: true,
            },
        });
        const passes = memberships.flatMap((m) => m.walletPasses.map((wp) => ({
            id: wp.id,
            membershipId: wp.membershipId,
            provider: wp.provider,
            externalId: wp.externalId,
            status: wp.status,
            merchant: m.merchant.name,
            points: m.points,
            visitsCount: m.visitsCount,
            level: m.level,
            levelInfo: m.levelInfo
                ? {
                    name: m.levelInfo.name,
                    color: m.levelInfo.color,
                    skinConfig: m.levelInfo.skinConfig,
                    benefits: m.levelInfo.benefits,
                }
                : null,
            skinVersion: wp.skinVersion,
            createdAt: wp.createdAt,
        })));
        return { passes };
    }
    async generatePass(userId, dto) {
        const customerProfile = await this.prisma.customerProfile.findUnique({
            where: { userId },
        });
        if (!customerProfile) {
            throw new common_1.NotFoundException('Customer profile not found');
        }
        const membership = await this.prisma.membership.findUnique({
            where: { id: dto.membershipId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        if (membership.customerId !== customerProfile.id) {
            throw new common_1.NotFoundException('Membership not found');
        }
        const existingPass = await this.prisma.walletPass.findFirst({
            where: { membershipId: dto.membershipId, status: 'ACTIVE' },
        });
        if (existingPass) {
            return { pass: existingPass, message: 'Wallet pass already exists' };
        }
        const pass = await this.prisma.walletPass.create({
            data: {
                membershipId: dto.membershipId,
                provider: 'INTERNAL',
                status: 'ACTIVE',
            },
        });
        return { pass, message: 'Wallet pass generated successfully' };
    }
    async getPassById(passId) {
        const pass = await this.prisma.walletPass.findUnique({
            where: { id: passId },
            include: { membership: { include: { merchant: true } } },
        });
        if (!pass)
            throw new common_1.NotFoundException('Wallet pass not found');
        return pass;
    }
    async revokePass(passId) {
        const pass = await this.prisma.walletPass.findUnique({ where: { id: passId } });
        if (!pass)
            throw new common_1.NotFoundException('Wallet pass not found');
        return this.prisma.walletPass.update({
            where: { id: passId },
            data: { status: 'REVOKED' },
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map