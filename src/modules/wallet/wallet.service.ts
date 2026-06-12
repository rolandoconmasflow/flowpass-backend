import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GeneratePassDto } from '../../dtos/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyCards(userId: string) {
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

    const passes = memberships.flatMap((m) =>
      m.walletPasses.map((wp) => ({
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
      })),
    );

    return { passes };
  }

  async generatePass(userId: string, dto: GeneratePassDto) {
    const customerProfile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!customerProfile) {
      throw new NotFoundException('Customer profile not found');
    }

    const membership = await this.prisma.membership.findUnique({
      where: { id: dto.membershipId },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.customerId !== customerProfile.id) {
      throw new NotFoundException('Membership not found');
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

  async getPassById(passId: string) {
    const pass = await this.prisma.walletPass.findUnique({
      where: { id: passId },
      include: { membership: { include: { merchant: true } } },
    });
    if (!pass) throw new NotFoundException('Wallet pass not found');
    return pass;
  }

  async revokePass(passId: string) {
    const pass = await this.prisma.walletPass.findUnique({ where: { id: passId } });
    if (!pass) throw new NotFoundException('Wallet pass not found');
    return this.prisma.walletPass.update({
      where: { id: passId },
      data: { status: 'REVOKED' },
    });
  }
}
