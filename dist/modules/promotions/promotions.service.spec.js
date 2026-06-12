"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const promotions_service_1 = require("./promotions.service");
const prisma_service_1 = require("../database/prisma.service");
describe('PromotionsService', () => {
    let promotionsService;
    const mockTx = {
        coupon: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    const mockPrisma = {
        promotion: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
        customerProfile: {
            findUnique: jest.fn(),
        },
        loyaltyCard: {
            findFirst: jest.fn(),
        },
        $transaction: jest.fn(),
    };
    function mockPromotion(overrides = {}) {
        return {
            id: 'promo-1',
            title: '20% OFF',
            description: null,
            imageUrl: null,
            discountType: 'PERCENTAGE',
            discountValue: 20,
            discountAmount: null,
            buyQuantity: null,
            getQuantity: null,
            minPurchase: null,
            maxClaims: 100,
            validFrom: new Date(),
            validUntil: new Date(),
            isActive: true,
            terms: null,
            pointsCost: null,
            loyaltyProgramId: null,
            merchantId: 'merchant-1',
            locationId: null,
            claimEndsAt: null,
            validTo: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            merchant: { id: 'merchant-1', name: 'Test Merchant' },
            _count: { coupons: 50 },
            ...overrides,
        };
    }
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [promotions_service_1.PromotionsService, { provide: prisma_service_1.PrismaService, useValue: mockPrisma }],
        }).compile();
        promotionsService = module.get(promotions_service_1.PromotionsService);
        jest.clearAllMocks();
    });
    describe('claimPromotion', () => {
        it('should claim a promotion and return a new coupon', async () => {
            mockPrisma.promotion.findUnique.mockResolvedValue(mockPromotion());
            mockPrisma.customerProfile.findUnique.mockResolvedValue({ id: 'cust-1' });
            mockTx.coupon.findFirst.mockResolvedValue(null);
            mockTx.coupon.create.mockResolvedValue({
                code: 'FLOW-ABC',
                promotion: { title: '20% OFF' },
                merchant: { name: 'Test Merchant' },
            });
            mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockTx));
            const result = await promotionsService.claimPromotion('promo-1', { id: 'user-1' });
            expect(result.message).toBe('Coupon claimed successfully');
            expect(result.coupon.code).toMatch(/^FLOW-/);
            expect(mockTx.coupon.findFirst).toHaveBeenCalled();
            expect(mockTx.coupon.create).toHaveBeenCalled();
        });
        it('should return existing coupon if already claimed', async () => {
            mockPrisma.promotion.findUnique.mockResolvedValue(mockPromotion());
            mockPrisma.customerProfile.findUnique.mockResolvedValue({ id: 'cust-1' });
            mockTx.coupon.findFirst.mockResolvedValue({ id: 'existing-coupon' });
            mockTx.coupon.findUnique.mockResolvedValue({
                code: 'FLOW-EXISTING',
                promotion: { title: '20% OFF' },
                merchant: { name: 'Test Merchant' },
            });
            mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockTx));
            const result = await promotionsService.claimPromotion('promo-1', { id: 'user-1' });
            expect(result.message).toBe('Coupon already claimed');
            expect(result.coupon.code).toBe('FLOW-EXISTING');
            expect(mockTx.coupon.findFirst).toHaveBeenCalled();
            expect(mockTx.coupon.create).not.toHaveBeenCalled();
        });
        it('should throw NotFoundException for unknown promotion', async () => {
            mockPrisma.promotion.findUnique.mockResolvedValue(null);
            await expect(promotionsService.claimPromotion('invalid', { id: 'user-1' })).rejects.toThrow(common_1.NotFoundException);
        });
        it('should throw BadRequestException if user has no customer profile', async () => {
            mockPrisma.promotion.findUnique.mockResolvedValue(mockPromotion());
            mockPrisma.customerProfile.findUnique.mockResolvedValue(null);
            await expect(promotionsService.claimPromotion('promo-1', { id: 'user-1' })).rejects.toThrow(common_1.BadRequestException);
        });
    });
});
//# sourceMappingURL=promotions.service.spec.js.map