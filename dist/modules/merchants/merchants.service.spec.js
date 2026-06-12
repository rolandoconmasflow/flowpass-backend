"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const merchants_service_1 = require("./merchants.service");
const prisma_service_1 = require("../database/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
describe('MerchantsService', () => {
    let service;
    const mockPrisma = {
        merchant: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                merchants_service_1.MerchantsService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
                { provide: jwt_1.JwtService, useValue: {} },
                { provide: uploads_service_1.UploadsService, useValue: {} },
            ],
        }).compile();
        service = module.get(merchants_service_1.MerchantsService);
        jest.clearAllMocks();
    });
    describe('findPublic', () => {
        it('consulta solo comercios con al menos una ubicación', async () => {
            mockPrisma.merchant.findMany.mockResolvedValue([{ id: 'm1', name: 'Demo' }]);
            const result = await service.findPublic();
            expect(mockPrisma.merchant.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { locations: { some: {} } } }));
            expect(result).toEqual([{ id: 'm1', name: 'Demo' }]);
        });
    });
    describe('findByOwnerId', () => {
        it('devuelve el comercio del owner indicado', async () => {
            const merchant = { id: 'm1', ownerId: 'owner-1' };
            mockPrisma.merchant.findFirst.mockResolvedValue(merchant);
            const result = await service.findByOwnerId('owner-1');
            expect(mockPrisma.merchant.findFirst).toHaveBeenCalledWith({ where: { ownerId: 'owner-1' } });
            expect(result).toEqual(merchant);
        });
    });
});
//# sourceMappingURL=merchants.service.spec.js.map