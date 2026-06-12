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
var MerchantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../database/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
const paginated_dto_1 = require("../../dtos/paginated.dto");
const bcrypt = require("bcrypt");
let MerchantsService = MerchantsService_1 = class MerchantsService {
    prisma;
    jwtService;
    uploadsService;
    logger = new common_1.Logger(MerchantsService_1.name);
    constructor(prisma, jwtService, uploadsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.uploadsService = uploadsService;
    }
    async findPublic() {
        return await this.prisma.merchant.findMany({
            where: { locations: { some: {} } },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                logoUrl: true,
                category: true,
                locations: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                    },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 12,
        });
    }
    async findAll(query) {
        if (!query) {
            return await this.prisma.merchant.findMany();
        }
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.merchant.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.merchant.count(),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        return await this.prisma.merchant.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return await this.prisma.merchant.create({ data: data });
    }
    async update(id, data) {
        return await this.prisma.merchant.update({
            where: { id },
            data: data,
        });
    }
    async findByOwnerId(ownerId) {
        return await this.prisma.merchant.findFirst({
            where: { ownerId },
        });
    }
    async findAllByOwnerId(ownerId) {
        return await this.prisma.merchant.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async switchActiveMerchant(userId, merchantId) {
        const merchant = await this.prisma.merchant.findFirst({
            where: { id: merchantId, ownerId: userId },
        });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found or not owned by you');
        }
        return merchant;
    }
    async updateLogo(id, file) {
        const merchant = await this.prisma.merchant.findUnique({ where: { id } });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        if (merchant.logoUrl) {
            const filename = merchant.logoUrl.replace('/uploads/', '');
            await this.uploadsService.deleteFile(filename);
        }
        const url = await this.uploadsService.saveFile(file);
        return this.prisma.merchant.update({
            where: { id },
            data: { logoUrl: url },
        });
    }
    async getLogo(id) {
        const merchant = await this.prisma.merchant.findUnique({ where: { id } });
        if (!merchant) {
            throw new common_1.NotFoundException('Merchant not found');
        }
        return { logoUrl: merchant.logoUrl ?? null };
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.ownerEmail } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.ownerPassword, 10);
        const slug = dto.businessName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const result = await this.prisma.$transaction(async (tx) => {
            const owner = await tx.user.create({
                data: {
                    email: dto.ownerEmail,
                    name: dto.ownerName || dto.businessName,
                    passwordHash,
                    role: 'MERCHANT_OWNER',
                },
            });
            const merchant = await tx.merchant.create({
                data: {
                    name: dto.businessName,
                    slug,
                    description: dto.businessDescription,
                    category: dto.category,
                    ownerId: owner.id,
                    levelsEnabled: true,
                },
            });
            await tx.merchantLocation.create({
                data: {
                    merchantId: merchant.id,
                    name: dto.city,
                    address: dto.address,
                    city: dto.city,
                    country: dto.country,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                },
            });
            await tx.loyaltyProgram.create({
                data: {
                    merchantId: merchant.id,
                    name: `${dto.businessName} Rewards`,
                    type: 'POINTS',
                    pointsPerVisit: 10,
                    visitsRequiredForReward: 10,
                },
            });
            return { owner, merchant };
        });
        const payload = {
            email: result.owner.email,
            sub: result.owner.id,
            role: result.owner.role,
            activeMerchantId: result.merchant.id,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            merchant: result.merchant,
            user: {
                id: result.owner.id,
                email: result.owner.email,
                name: result.owner.name,
                role: result.owner.role,
            },
            access_token: accessToken,
            activeMerchantId: result.merchant.id,
        };
    }
};
exports.MerchantsService = MerchantsService;
exports.MerchantsService = MerchantsService = MerchantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        uploads_service_1.UploadsService])
], MerchantsService);
//# sourceMappingURL=merchants.service.js.map