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
var StaffService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let StaffService = StaffService_1 = class StaffService {
    prisma;
    logger = new common_1.Logger(StaffService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addStaff(merchantId, userId, role = client_1.UserRole.MERCHANT_STAFF) {
        const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existing = await this.prisma.merchantStaff.findUnique({
            where: { merchantId_userId: { merchantId, userId } },
        });
        if (existing)
            throw new common_1.BadRequestException('User already staff at this merchant');
        return this.prisma.merchantStaff.create({
            data: { merchantId, userId, role },
            include: { user: { select: { id: true, name: true, email: true, role: true } } },
        });
    }
    async listStaff(merchantId) {
        return this.prisma.merchantStaff.findMany({
            where: { merchantId },
            include: { user: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async removeStaff(merchantId, userId) {
        const staff = await this.prisma.merchantStaff.findUnique({
            where: { merchantId_userId: { merchantId, userId } },
        });
        if (!staff)
            throw new common_1.NotFoundException('Staff member not found');
        if (staff.role === client_1.UserRole.MERCHANT_OWNER) {
            throw new common_1.BadRequestException('Cannot remove a merchant owner');
        }
        await this.prisma.merchantStaff.delete({
            where: { merchantId_userId: { merchantId, userId } },
        });
        return { success: true };
    }
    async updateStaffRole(merchantId, userId, role) {
        const staff = await this.prisma.merchantStaff.findUnique({
            where: { merchantId_userId: { merchantId, userId } },
        });
        if (!staff)
            throw new common_1.NotFoundException('Staff member not found');
        if (staff.role === client_1.UserRole.MERCHANT_OWNER) {
            throw new common_1.BadRequestException('Cannot change owner role');
        }
        return this.prisma.merchantStaff.update({
            where: { merchantId_userId: { merchantId, userId } },
            data: { role },
            include: { user: { select: { id: true, name: true, email: true, role: true } } },
        });
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = StaffService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffService);
//# sourceMappingURL=staff.service.js.map