import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findCustomerProfile(userId: string) {
    return this.prisma.customerProfile.findUnique({
      where: { userId },
    });
  }

  async getCustomerMemberships(customerId: string) {
    // Obtener todas las membresías de un cliente
    return this.prisma.membership.findMany({
      where: { customerId },
      include: {
        merchant: true,
        loyaltyProgram: true,
        levelInfo: true,
      }
    });
  }

  async getMembershipById(id: string) {
    // Obtener membresía por ID
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

  async createMembership(customerId: string, merchantId: string, loyaltyProgramId: string) {
    // Crear nueva membresía
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

  async updateMembershipPoints(membershipId: string, points: number) {
    // Actualizar puntos de membresía
    return this.prisma.membership.update({
      where: { id: membershipId },
      data: {
        points: {
          increment: points
        }
      }
    });
  }

  async updateMembershipVisits(membershipId: string) {
    // Actualizar contador de visitas
    return this.prisma.membership.update({
      where: { id: membershipId },
      data: {
        visitsCount: {
          increment: 1
        }
      }
    });
  }
}