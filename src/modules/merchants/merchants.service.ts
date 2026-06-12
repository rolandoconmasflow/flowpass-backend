import { Injectable, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UploadsService, UploadFile } from '../uploads/uploads.service';
import { CreateMerchantDto, UpdateMerchantDto, RegisterMerchantDto } from '../../dtos/merchant.dto';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MerchantsService {
  private readonly logger = new Logger(MerchantsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly uploadsService: UploadsService,
  ) {}

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

  async findAll(query?: PaginatedQueryDto) {
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
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string) {
    return await this.prisma.merchant.findUnique({
      where: { id },
    });
  }

  async create(data: CreateMerchantDto) {
    return await this.prisma.merchant.create({ data: data as Prisma.MerchantUncheckedCreateInput });
  }

  async update(id: string, data: UpdateMerchantDto) {
    return await this.prisma.merchant.update({
      where: { id },
      data: data as Prisma.MerchantUncheckedUpdateInput,
    });
  }

  async findByOwnerId(ownerId: string) {
    return await this.prisma.merchant.findFirst({
      where: { ownerId },
    });
  }

  async findAllByOwnerId(ownerId: string) {
    return await this.prisma.merchant.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async switchActiveMerchant(userId: string, merchantId: string) {
    // Verificar que el merchant existe y pertenece al usuario
    const merchant = await this.prisma.merchant.findFirst({
      where: { id: merchantId, ownerId: userId },
    });
    if (!merchant) {
      throw new NotFoundException('Merchant not found or not owned by you');
    }
    return merchant;
  }

  async updateLogo(id: string, file: UploadFile) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
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

  async getLogo(id: string) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id } });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    return { logoUrl: merchant.logoUrl ?? null };
  }

  async register(dto: RegisterMerchantDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.ownerEmail } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
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

    const payload: JwtPayload = {
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
}
