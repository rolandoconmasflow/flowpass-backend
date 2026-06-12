import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { PrismaService } from '../database/prisma.service';
import { STRIPE_CLIENT } from './stripe.provider';

describe('BillingService', () => {
  let service: BillingService;

  const mockStripe = {
    checkout: { sessions: { create: jest.fn() } },
    webhooks: { constructEvent: jest.fn() },
    subscriptions: { update: jest.fn() },
    billingPortal: { sessions: { create: jest.fn() } },
  };

  const mockPrisma = {
    subscriptionPlan: { findMany: jest.fn(), findUnique: jest.fn() },
    merchant: { findFirst: jest.fn() },
    merchantSubscription: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    payment: { create: jest.fn(), findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: STRIPE_CLIENT, useValue: mockStripe },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    jest.clearAllMocks();
  });

  describe('getPlans', () => {
    it('devuelve solo planes activos ordenados', async () => {
      const plans = [{ id: 'p1', name: 'Mensual', isActive: true }];
      mockPrisma.subscriptionPlan.findMany.mockResolvedValue(plans);

      const result = await service.getPlans();

      expect(mockPrisma.subscriptionPlan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      expect(result).toEqual(plans);
    });
  });

  describe('createCheckoutSession', () => {
    it('crea una sesión de Stripe y devuelve la url', async () => {
      mockPrisma.merchant.findFirst.mockResolvedValue({ id: 'merchant-1', ownerId: 'user-1' });
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'plan-1',
        name: 'Mensual',
        price: 5000,
        currency: 'ARS',
        intervalCount: 1,
        isActive: true,
        stripePriceId: null,
      });
      mockPrisma.merchantSubscription.findUnique.mockResolvedValue(null);
      mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://stripe.test/checkout' });

      const result = await service.createCheckoutSession('user-1', 'plan-1');

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
      expect(result).toEqual({ url: 'https://stripe.test/checkout' });
    });

    it('lanza error si el plan no existe', async () => {
      mockPrisma.merchant.findFirst.mockResolvedValue({ id: 'merchant-1' });
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(null);

      await expect(service.createCheckoutSession('user-1', 'missing')).rejects.toThrow();
    });
  });

  describe('handleWebhook', () => {
    const OLD_ENV = process.env.STRIPE_WEBHOOK_SECRET;
    beforeAll(() => {
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    });
    afterAll(() => {
      process.env.STRIPE_WEBHOOK_SECRET = OLD_ENV;
    });

    it('procesa checkout.session.completed creando suscripción y pago', async () => {
      mockStripe.webhooks.constructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { merchantId: 'merchant-1', planId: 'plan-1' },
            customer: 'cus_1',
            subscription: 'sub_1',
            invoice: 'in_1',
          },
        },
      });
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue({
        id: 'plan-1',
        price: 5000,
        currency: 'ARS',
        intervalCount: 1,
      });
      mockPrisma.merchantSubscription.upsert.mockResolvedValue({
        id: 'sub-db-1',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      });
      mockPrisma.payment.create.mockResolvedValue({ id: 'pay-1' });

      const result = await service.handleWebhook('sig', Buffer.from('{}'));

      expect(mockPrisma.merchantSubscription.upsert).toHaveBeenCalled();
      expect(mockPrisma.payment.create).toHaveBeenCalled();
      expect(result).toEqual({ received: true });
    });

    it('rechaza firma inválida', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('bad signature');
      });

      await expect(service.handleWebhook('bad', Buffer.from('{}'))).rejects.toThrow(BadRequestException);
    });
  });
});
