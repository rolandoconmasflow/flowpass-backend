import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('No autenticado');
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.role !== 'MERCHANT_OWNER') return true;

    const merchant = await this.prisma.merchant.findFirst({
      where: { ownerId: user.id },
      include: { subscription: true },
    });

    if (!merchant) return true;
    if (!merchant.subscription) {
      throw new ForbiddenException('Suscripción requerida. Contratá un plan en /billing/plans');
    }
    if (merchant.subscription.status !== 'ACTIVE' && merchant.subscription.status !== 'TRIALING') {
      throw new ForbiddenException('Suscripción expirada. Renová tu plan en /billing/plans');
    }

    return true;
  }
}
