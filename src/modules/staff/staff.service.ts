import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addStaffByEmail(merchantId: string, email: string, role: UserRole = UserRole.MERCHANT_STAFF) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) throw new NotFoundException('Merchant not found');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User with this email not found');

    const staffCount = await this.prisma.merchantStaff.count({
      where: { merchantId, role: UserRole.MERCHANT_STAFF },
    });
    if (staffCount >= 3) {
      throw new BadRequestException('Maximum 3 staff members per merchant');
    }

    const existing = await this.prisma.merchantStaff.findUnique({
      where: { merchantId_userId: { merchantId, userId: user.id } },
    });
    if (existing) throw new BadRequestException('User already staff at this merchant');

    return this.prisma.merchantStaff.create({
      data: { merchantId, userId: user.id, role },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  async addStaff(merchantId: string, userId: string, role: UserRole = UserRole.MERCHANT_STAFF) {
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) throw new NotFoundException('Merchant not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.merchantStaff.findUnique({
      where: { merchantId_userId: { merchantId, userId } },
    });
    if (existing) throw new BadRequestException('User already staff at this merchant');

    return this.prisma.merchantStaff.create({
      data: { merchantId, userId, role },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  async listStaff(merchantId: string) {
    const staff = await this.prisma.merchantStaff.findMany({
      where: { merchantId },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const staffCount = await this.prisma.merchantStaff.count({
      where: { merchantId, role: UserRole.MERCHANT_STAFF },
    });
    return { staff, count: staffCount, limit: 3 };
  }

  async removeStaff(merchantId: string, userId: string) {
    const staff = await this.prisma.merchantStaff.findUnique({
      where: { merchantId_userId: { merchantId, userId } },
    });
    if (!staff) throw new NotFoundException('Staff member not found');

    if (staff.role === UserRole.MERCHANT_OWNER) {
      throw new BadRequestException('Cannot remove a merchant owner');
    }

    await this.prisma.merchantStaff.delete({
      where: { merchantId_userId: { merchantId, userId } },
    });

    return { success: true };
  }

  async updateStaffRole(merchantId: string, userId: string, role: UserRole) {
    const staff = await this.prisma.merchantStaff.findUnique({
      where: { merchantId_userId: { merchantId, userId } },
    });
    if (!staff) throw new NotFoundException('Staff member not found');

    if (staff.role === UserRole.MERCHANT_OWNER) {
      throw new BadRequestException('Cannot change owner role');
    }

    return this.prisma.merchantStaff.update({
      where: { merchantId_userId: { merchantId, userId } },
      data: { role },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
  }
}
