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
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let LoyaltyService = class LoyaltyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProgram(data) {
        return this.prisma.loyaltyProgram.create({ data });
    }
    async getAllPrograms() {
        return this.prisma.loyaltyProgram.findMany({
            include: { merchant: true, rewards: true },
        });
    }
    async getProgramById(id) {
        const program = await this.prisma.loyaltyProgram.findUnique({
            where: { id },
            include: { merchant: true, rewards: true, memberships: true },
        });
        if (!program)
            throw new common_1.NotFoundException('Loyalty program not found');
        return program;
    }
    async getProgramsByMerchant(merchantId) {
        return this.prisma.loyaltyProgram.findMany({
            where: { merchantId },
            include: { rewards: true },
        });
    }
    async updateProgram(id, data) {
        const program = await this.prisma.loyaltyProgram.findUnique({ where: { id } });
        if (!program)
            throw new common_1.NotFoundException('Loyalty program not found');
        return this.prisma.loyaltyProgram.update({ where: { id }, data });
    }
    async deleteProgram(id) {
        const program = await this.prisma.loyaltyProgram.findUnique({ where: { id } });
        if (!program)
            throw new common_1.NotFoundException('Loyalty program not found');
        return this.prisma.loyaltyProgram.delete({ where: { id } });
    }
    async createReward(data) {
        return this.prisma.reward.create({ data });
    }
    async getAllRewards() {
        return this.prisma.reward.findMany({
            include: { merchant: true, loyaltyProgram: true },
        });
    }
    async getRewardById(id) {
        const reward = await this.prisma.reward.findUnique({
            where: { id },
            include: { merchant: true, loyaltyProgram: true, redemptions: true },
        });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        return reward;
    }
    async getRewardsByMerchant(merchantId) {
        return this.prisma.reward.findMany({
            where: { merchantId },
            include: { loyaltyProgram: true },
        });
    }
    async updateReward(id, data) {
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        return this.prisma.reward.update({ where: { id }, data });
    }
    async deleteReward(id) {
        const reward = await this.prisma.reward.findUnique({ where: { id } });
        if (!reward)
            throw new common_1.NotFoundException('Reward not found');
        return this.prisma.reward.delete({ where: { id } });
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoyaltyService);
//# sourceMappingURL=loyalty.service.js.map