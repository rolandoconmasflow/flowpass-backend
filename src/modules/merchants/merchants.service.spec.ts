import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MerchantsService } from './merchants.service';
import { PrismaService } from '../database/prisma.service';
import { UploadsService } from '../uploads/uploads.service';

describe('MerchantsService', () => {
  let service: MerchantsService;

  const mockPrisma = {
    merchant: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: {} },
        { provide: UploadsService, useValue: {} },
      ],
    }).compile();

    service = module.get<MerchantsService>(MerchantsService);
    jest.clearAllMocks();
  });

  describe('findPublic', () => {
    it('consulta solo comercios con al menos una ubicación', async () => {
      mockPrisma.merchant.findMany.mockResolvedValue([{ id: 'm1', name: 'Demo' }]);

      const result = await service.findPublic();

      expect(mockPrisma.merchant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { locations: { some: {} } } }),
      );
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
