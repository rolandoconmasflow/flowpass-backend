import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CouponStatus, RedemptionChannel, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async findCustomerProfileByUserId(userId: string) {
    return this.prisma.customerProfile.findUnique({
      where: { userId },
    });
  }

  async createCoupon(data: Prisma.CouponCreateInput) {
    return await this.prisma.coupon.create({
      data,
    });
  }

  async getCouponsByCustomer(customerId: string, query?: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where = { customerId };
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        include: { promotion: true, merchant: true },
        orderBy: { claimedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async getCouponsByUserId(userId: string, query?: PaginatedQueryDto) {
    let customerProfile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!customerProfile) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      customerProfile = await this.prisma.customerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, displayName: user.name || user.email },
        update: { displayName: user.name || user.email },
      });
    }

    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where = { customerId: customerProfile.id };
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        include: { promotion: true, merchant: true },
        orderBy: { claimedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async getAllCoupons(query: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        include: {
          promotion: true,
          merchant: true,
          customer: {
            include: { user: true },
          },
        },
        orderBy: { claimedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coupon.count(),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async getCouponsByMerchant(merchantId: string, query: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where = { merchantId };
    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        include: {
          promotion: true,
          customer: {
            include: { user: true },
          },
        },
        orderBy: { claimedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async cancelCoupon(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.status === CouponStatus.REDEEMED) {
      throw new BadRequestException('Cannot cancel a redeemed coupon');
    }

    return await this.prisma.coupon.update({
      where: { id },
      data: { status: CouponStatus.CANCELLED },
      include: {
        promotion: true,
        merchant: true,
        customer: {
          include: { user: true },
        },
      },
    });
  }

  async getCouponByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        promotion: true,
        merchant: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return {
      isValid: coupon.status === CouponStatus.CLAIMED,
      coupon,
      summary: {
        code: coupon.code,
        status: coupon.status,
        merchant: coupon.merchant?.name,
        promotionTitle: coupon.promotion?.title,
        promotionDescription: coupon.promotion?.description,
        customer: coupon.customer?.user?.name || coupon.customer?.user?.email,
        claimedAt: coupon.claimedAt,
        expiresAt: coupon.expiresAt,
        redeemedAt: coupon.redeemedAt,
      },
    };
  }

  async redeemCoupon(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        promotion: true,
        merchant: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.status === CouponStatus.REDEEMED) {
      return {
        message: 'Coupon already redeemed',
        coupon,
      };
    }

    if (coupon.status !== CouponStatus.CLAIMED) {
      throw new BadRequestException(`Coupon cannot be redeemed with status ${coupon.status}`);
    }

    const redeemedCoupon = await this.prisma.coupon.update({
      where: { code },
      data: {
        status: CouponStatus.REDEEMED,
        redeemedAt: new Date(),
        redemptionChannel: RedemptionChannel.ADMIN_PANEL,
      },
      include: {
        promotion: true,
        merchant: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      message: 'Coupon redeemed successfully',
      coupon: redeemedCoupon,
      summary: {
        code: redeemedCoupon.code,
        status: redeemedCoupon.status,
        merchant: redeemedCoupon.merchant?.name,
        promotionTitle: redeemedCoupon.promotion?.title,
        customer: redeemedCoupon.customer?.user?.name || redeemedCoupon.customer?.user?.email,
        claimedAt: redeemedCoupon.claimedAt,
        redeemedAt: redeemedCoupon.redeemedAt,
      },
    };
  }
}
