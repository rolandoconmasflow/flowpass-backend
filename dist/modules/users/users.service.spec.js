"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../database/prisma.service");
const bcrypt = require("bcrypt");
describe('UsersService', () => {
    let usersService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [users_service_1.UsersService, { provide: prisma_service_1.PrismaService, useValue: mockPrisma }],
        }).compile();
        usersService = module.get(users_service_1.UsersService);
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
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
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
            await expect(usersService.create({
                email: 'dup@flowpass.com',
                password: 'password123',
                name: 'Dup',
            })).rejects.toThrow(common_1.ConflictException);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map