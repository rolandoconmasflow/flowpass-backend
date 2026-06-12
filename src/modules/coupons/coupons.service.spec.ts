import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { PrismaService } from '../database/prisma.service';
import { CouponStatus } from '@prisma/client';

describe('CouponsService', () => {
  let couponsService: CouponsService;

  const mockPrisma = {
    coupon: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    customerProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    couponsService = module.get<CouponsService>(CouponsService);
    jest.clearAllMocks();
  });

  describe('getCouponByCode', () => {
    it('should return coupon details for valid code', async () => {
      const mockCoupon = {
        id: 'coupon-1',
        code: 'FLOW-ABC123',
        status: CouponStatus.CLAIMED,
        claimedAt: new Date(),
        promotion: { title: '20% OFF' },
        merchant: { name: 'Test Merchant' },
        customer: { user: { name: 'Test User', email: 'test@flowpass.com' } },
      };
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);

      const result = await couponsService.getCouponByCode('FLOW-ABC123');

      expect(result.isValid).toBe(true);
      expect(result.summary.code).toBe('FLOW-ABC123');
    });

    it('should throw NotFoundException for invalid code', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(null);

      await expect(couponsService.getCouponByCode('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('redeemCoupon', () => {
    it('should redeem a claimed coupon', async () => {
      const mockCoupon = {
        id: 'coupon-1',
        code: 'FLOW-ABC123',
        status: CouponStatus.CLAIMED,
        claimedAt: new Date(),
        promotion: { title: '20% OFF' },
        merchant: { name: 'Test Merchant' },
        customer: { user: { name: 'Test User' } },
      };
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);
      mockPrisma.coupon.update.mockResolvedValue({
        ...mockCoupon,
        status: CouponStatus.REDEEMED,
        redeemedAt: new Date(),
      });

      const result = await couponsService.redeemCoupon('FLOW-ABC123');

      expect(result.message).toBe('Coupon redeemed successfully');
    });

    it('should return already redeemed if coupon already redeemed', async () => {
      const mockCoupon = {
        code: 'FLOW-ABC123',
        status: CouponStatus.REDEEMED,
        claimedAt: new Date(),
      };
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);

      const result = await couponsService.redeemCoupon('FLOW-ABC123');

      expect(result.message).toBe('Coupon already redeemed');
    });
  });

  describe('getCouponsByUserId', () => {
    it('should auto-create profile and return empty coupons', async () => {
      const mockUser = { id: 'user-1', email: 'test@flowpass.com', name: 'Test' };
      mockPrisma.customerProfile.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.customerProfile.upsert.mockResolvedValue({
        id: 'profile-1',
        userId: 'user-1',
        displayName: 'Test',
      });
      mockPrisma.coupon.findMany.mockResolvedValue([]);
      mockPrisma.coupon.count.mockResolvedValue(0);

      const result = await couponsService.getCouponsByUserId('user-1');

      expect(result.data).toEqual([]);
      expect(mockPrisma.customerProfile.upsert).toHaveBeenCalled();
    });
  });
});
