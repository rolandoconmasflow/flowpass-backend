import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { STRIPE_CLIENT, StripeClient } from './stripe.provider';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(STRIPE_CLIENT) private readonly stripe: StripeClient | null,
  ) {}

  private get webUrl(): string {
    return process.env.WEB_ADMIN_URL || 'http://localhost:3000';
  }

  private requireStripe(): StripeClient {
    if (!this.stripe) {
      throw new BadRequestException('Stripe no está configurado. Definí STRIPE_SECRET_KEY en el backend.');
    }
    return this.stripe;
  }

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getMySubscription(userId: string) {
    const merchant = await this.findMerchantByOwner(userId);
    if (!merchant) return null;
    return this.prisma.merchantSubscription.findUnique({
      where: { merchantId: merchant.id },
      include: { plan: true },
    });
  }

  async createCheckoutSession(userId: string, planId: string) {
    const stripe = this.requireStripe();
    const merchant = await this.findMerchantByOwner(userId);
    if (!merchant) throw new NotFoundException('No se encontró el comercio del usuario');

    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) throw new NotFoundException('Plan no encontrado');

    const existing = await this.prisma.merchantSubscription.findUnique({
      where: { merchantId: merchant.id },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: plan.stripePriceId
        ? [{ price: plan.stripePriceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: plan.currency.toLowerCase(),
                unit_amount: Math.round(Number(plan.price) * 100),
                recurring: { interval: 'month', interval_count: plan.intervalCount },
                product_data: { name: plan.name },
              },
            },
          ],
      customer: existing?.stripeCustomerId || undefined,
      client_reference_id: merchant.id,
      metadata: { merchantId: merchant.id, planId: plan.id },
      success_url: `${this.webUrl}/billing/manage?status=success`,
      cancel_url: `${this.webUrl}/billing/plans?status=cancelled`,
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const stripe = this.requireStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET no configurado');
    }

    let event: { type: string; data: { object: any } };
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as any;
    } catch (err) {
      this.logger.error(`Webhook signature inválida: ${(err as Error).message}`);
      throw new BadRequestException('Firma de webhook inválida');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.onCheckoutCompleted(event.data.object);
        break;
      case 'invoice.paid':
        await this.onInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.onInvoiceFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.onSubscriptionDeleted(event.data.object);
        break;
      default:
        this.logger.log(`Evento de Stripe no manejado: ${event.type}`);
    }

    return { received: true };
  }

  async cancelSubscription(userId: string) {
    const merchant = await this.findMerchantByOwner(userId);
    if (!merchant) throw new NotFoundException('No se encontró el comercio del usuario');

    const subscription = await this.prisma.merchantSubscription.findUnique({
      where: { merchantId: merchant.id },
    });
    if (!subscription) throw new NotFoundException('No tenés una suscripción activa');

    if (subscription.stripeSubscriptionId && this.stripe) {
      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    return this.prisma.merchantSubscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
  }

  async getInvoices(userId: string) {
    const subscription = await this.getMySubscription(userId);
    if (!subscription) return [];
    return this.prisma.payment.findMany({
      where: { subscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPortalUrl(userId: string) {
    const stripe = this.requireStripe();
    const subscription = await this.getMySubscription(userId);
    if (!subscription?.stripeCustomerId) {
      throw new NotFoundException('No hay cliente de Stripe asociado');
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.webUrl}/billing/manage`,
    });
    return { url: portal.url };
  }

  // ─── Webhook handlers ──────────────────────────────────────────

  private async onCheckoutCompleted(session: any) {
    const merchantId = session.metadata?.merchantId || session.client_reference_id;
    const planId = session.metadata?.planId;
    if (!merchantId || !planId) {
      this.logger.warn('checkout.session.completed sin merchantId/planId en metadata');
      return;
    }

    const now = new Date();
    const periodEnd = this.computePeriodEnd(now, planId);
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const stripeSubscriptionId =
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    const subscription = await this.prisma.merchantSubscription.upsert({
      where: { merchantId },
      create: {
        merchantId,
        planId,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: await periodEnd,
        stripeCustomerId,
        stripeSubscriptionId,
      },
      update: {
        planId,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: await periodEnd,
        cancelledAt: null,
        stripeCustomerId,
        stripeSubscriptionId,
      },
    });

    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: plan?.price ?? 0,
        currency: plan?.currency ?? 'ARS',
        status: 'COMPLETED',
        periodStart: subscription.currentPeriodStart,
        periodEnd: subscription.currentPeriodEnd,
        paidAt: now,
        stripeInvoiceId: typeof session.invoice === 'string' ? session.invoice : session.invoice?.id,
      },
    });

    this.logger.log(`Suscripción activada para merchant ${merchantId}`);
  }

  private async onInvoicePaid(invoice: any) {
    const stripeSubscriptionId =
      typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
    if (!stripeSubscriptionId) return;

    const subscription = await this.prisma.merchantSubscription.findFirst({
      where: { stripeSubscriptionId },
    });
    if (!subscription) return;

    const newPeriodEnd = await this.computePeriodEnd(new Date(), subscription.planId);
    await this.prisma.merchantSubscription.update({
      where: { id: subscription.id },
      data: { status: 'ACTIVE', currentPeriodEnd: newPeriodEnd },
    });

    await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: (invoice.amount_paid ?? 0) / 100,
        currency: (invoice.currency ?? 'ars').toUpperCase(),
        status: 'COMPLETED',
        periodStart: new Date(),
        periodEnd: newPeriodEnd,
        paidAt: new Date(),
        stripeInvoiceId: invoice.id,
        invoiceUrl: invoice.hosted_invoice_url ?? undefined,
      },
    });
  }

  private async onInvoiceFailed(invoice: any) {
    const stripeSubscriptionId =
      typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
    if (!stripeSubscriptionId) return;

    const subscription = await this.prisma.merchantSubscription.findFirst({
      where: { stripeSubscriptionId },
    });
    if (!subscription) return;

    await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: (invoice.amount_due ?? 0) / 100,
        currency: (invoice.currency ?? 'ars').toUpperCase(),
        status: 'FAILED',
        periodStart: new Date(),
        periodEnd: new Date(),
        stripeInvoiceId: invoice.id,
      },
    });
  }

  private async onSubscriptionDeleted(stripeSub: any) {
    const subscription = await this.prisma.merchantSubscription.findFirst({
      where: { stripeSubscriptionId: stripeSub.id },
    });
    if (!subscription) return;
    await this.prisma.merchantSubscription.update({
      where: { id: subscription.id },
      data: { status: 'EXPIRED' },
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────

  private async findMerchantByOwner(userId: string) {
    return this.prisma.merchant.findFirst({ where: { ownerId: userId } });
  }

  private async computePeriodEnd(start: Date, planId: string): Promise<Date> {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    const months = plan?.intervalCount ?? 1;
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    return end;
  }
}
