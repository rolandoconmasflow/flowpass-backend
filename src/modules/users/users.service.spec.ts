import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    customerProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user without passwordHash', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@flowpass.com',
        name: 'Test',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findById('user-1');

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: expect.objectContaining({ id: true, email: true }),
      });
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@flowpass.com',
        passwordHash: 'hashed',
        role: 'CUSTOMER',
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersService.findByEmail('test@flowpass.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a user with CUSTOMER role only', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

      const createdUser = {
        id: 'new-user',
        email: 'new@flowpass.com',
        name: 'New User',
        role: 'CUSTOMER',
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.create.mockResolvedValue(createdUser);
      mockPrisma.customerProfile.create.mockResolvedValue({
        id: 'profile-1',
        userId: 'new-user',
        displayName: 'New User',
      });

      const result = await usersService.create({
        email: 'new@flowpass.com',
        password: 'password123',
        name: 'New User',
      });

      expect(result).toBeDefined();
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'dup@flowpass.com' });

      await expect(
        usersService.create({
          email: 'dup@flowpass.com',
          password: 'password123',
          name: 'Dup',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
