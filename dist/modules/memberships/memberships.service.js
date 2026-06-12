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
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let MembershipsService = class MembershipsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCustomerProfile(userId) {
        return this.prisma.customerProfile.findUnique({
            where: { userId },
        });
    }
    async getCustomerMemberships(customerId) {
        return this.prisma.membership.findMany({
            where: { customerId },
            include: {
                merchant: true,
                loyaltyProgram: true,
                levelInfo: true,
            }
        });
    }
    async getMembershipById(id) {
        return this.prisma.membership.findUnique({
            where: { id },
            include: {
                customer: {
                    include: {
                        user: true
                    }
                },
                merchant: true,
                loyaltyProgram: true,
                levelInfo: true,
            }
        });
    }
    async createMembership(customerId, merchantId, loyaltyProgramId) {
        return this.prisma.membership.create({
            data: {
                customerId,
                merchantId,
                loyaltyProgramId,
                points: 0,
                visitsCount: 0,
                status: 'ACTIVE',
                level: 'BRONZE'
            }
        });
    }
    async updateMembershipPoints(membershipId, points) {
        return this.prisma.membership.update({
            where: { id: membershipId },
            data: {
                points: {
                    increment: points
                }
            }
        });
    }
    async updateMembershipVisits(membershipId) {
        return this.prisma.membership.update({
            where: { id: membershipId },
            data: {
                visitsCount: {
                    increment: 1
                }
            }
        });
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map