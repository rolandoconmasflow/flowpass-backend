import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePromotionDto, UpdatePromotionDto } from '../../dtos/promotion.dto';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPromotion(data: CreatePromotionDto) {
    return await this.prisma.promotion.create({ data: data as Prisma.PromotionUncheckedCreateInput });
  }

  async getAllPromotions(query?: PaginatedQueryDto) {
    if (!query) {
      return await this.prisma.promotion.findMany({ include: { merchant: true } });
    }
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.promotion.findMany({
        skip,
        take: limit,
        include: { merchant: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count(),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async getPromotionById(id: string) {
    return await this.prisma.promotion.findUnique({
      where: { id },
      include: { merchant: true },
    });
  }

  async getPromotionsByMerchant(merchantId: string, query?: PaginatedQueryDto) {
    if (!query) {
      return await this.prisma.promotion.findMany({ where: { merchantId } });
    }
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where: { merchantId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count({ where: { merchantId } }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async updatePromotion(id: string, data: UpdatePromotionDto) {
    return await this.prisma.promotion.update({
      where: { id },
      data: data as Prisma.PromotionUncheckedUpdateInput,
    });
  }

  async deletePromotion(id: string) {
    return await this.prisma.promotion.delete({
      where: { id },
    });
  }
  private generateCouponCode() {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `FLOW-${Date.now().toString(36).toUpperCase()}-${random}`;
  }

  async getNearbyPromotions(lat: number, lng: number, radiusKm: number = 10) {
    const locations = await this.prisma.merchantLocation.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        promotions: { include: { merchant: true } },
        merchant: true,
      },
    });

    const nearbyPromotions = locations
      .filter((loc) => {
        if (loc.latitude === null || loc.longitude === null) return false;
        return this.haversine(lat, lng, loc.latitude, loc.longitude) <= radiusKm;
      })
      .flatMap((loc) => {
        const distance = this.haversine(lat, lng, loc.latitude!, loc.longitude!);
        return loc.promotions.map((promo) => ({
          ...promo,
          location: {
            id: loc.id,
            name: loc.name,
            address: loc.address,
            distance,
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
        }));
      })
      .sort((a, b) => a.location.distance - b.location.distance);

    return nearbyPromotions;
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async claimPromotion(promotionId: string, authUser: { id: string }) {
    const userId = authUser?.id;

    if (!userId) {
      throw new BadRequestException('Authenticated user not found');
    }

    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: {
        merchant: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const customerProfile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!customerProfile) {
      throw new BadRequestException('Customer profile not found for authenticated user');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const existingCoupon = await tx.coupon.findFirst({
        where: {
          promotionId,
          customerId: customerProfile.id,
          status: 'CLAIMED',
        },
      });

      if (existingCoupon) {
        const full = await tx.coupon.findUnique({
          where: { id: existingCoupon.id },
          include: { promotion: true, merchant: true },
        });
        return { isNew: false, coupon: full! };
      }

      const coupon = await tx.coupon.create({
        data: {
          promotionId: promotion.id,
          customerId: customerProfile.id,
          merchantId: promotion.merchantId,
          locationId: promotion.locationId || null,
          code: this.generateCouponCode(),
          qrCodeValue: `FLOWPASS-COUPON-${promotion.id}-${customerProfile.id}`,
          expiresAt: promotion.claimEndsAt || promotion.validTo || null,
        },
        include: {
          promotion: true,
          merchant: true,
        },
      });
      return { isNew: true, coupon };
    });

    return {
      message: result.isNew ? 'Coupon claimed successfully' : 'Coupon already claimed',
      coupon: result.coupon,
    };
  }
}
