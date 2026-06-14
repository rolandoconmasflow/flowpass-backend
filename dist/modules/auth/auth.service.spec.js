"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../database/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = require("bcrypt");
describe('AuthService', () => {
    let authService;
    let _usersService;
    let _jwtService;
    const mockUser = {
        id: 'user-1',
        email: 'test@flowpass.com',
        name: 'Test User',
        role: 'CUSTOMER',
        passwordHash: '$2b$10$hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const mockUsersService = {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        sanitizeUser: jest.fn((user) => {
            const { passwordHash: _pw, ...rest } = user;
            return rest;
        }),
    };
    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock-token'),
        verify: jest.fn(),
    };
    const mockPrismaService = {
        merchant: {
            findFirst: jest.fn().mockResolvedValue(null),
        },
    };
    const mockMailService = {
        sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
        sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
                { provide: mail_service_1.MailService, useValue: mockMailService },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        _usersService = module.get(users_service_1.UsersService);
        _jwtService = module.get(jwt_1.JwtService);
        jest.clearAllMocks();
    });
    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue(mockUser);
            const result = await authService.registerUser({
                email: 'test@flowpass.com',
                password: 'password123',
                name: 'Test User',
            });
            expect(result.user).toBeDefined();
            expect(result.access_token).toBe('mock-token');
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@flowpass.com');
            expect(mockUsersService.create).toHaveBeenCalled();
            expect(mockJwtService.sign).toHaveBeenCalled();
        });
        it('should throw ConflictException if email already exists', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            await expect(authService.registerUser({
                email: 'test@flowpass.com',
                password: 'password123',
            })).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const result = await authService.login({
                email: 'test@flowpass.com',
                password: 'password123',
            });
            expect(result.access_token).toBe('mock-token');
            expect(result.user).toBeDefined();
            expect(result.user).not.toHaveProperty('passwordHash');
        });
        it('should throw UnauthorizedException for invalid password', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await expect(authService.login({
                email: 'test@flowpass.com',
                password: 'wrongpassword',
            })).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('should throw UnauthorizedException if user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(authService.login({
                email: 'nonexistent@flowpass.com',
                password: 'password123',
            })).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('me', () => {
        it('should return sanitized user for valid token', async () => {
            mockJwtService.verify.mockReturnValue({ sub: 'user-1', email: 'test@flowpass.com', role: 'CUSTOMER' });
            mockUsersService.findById.mockResolvedValue({
                id: 'user-1',
                email: 'test@flowpass.com',
                role: 'CUSTOMER',
            });
            const result = await authService.me('valid-token');
            expect(result).toBeDefined();
            expect(result).not.toHaveProperty('passwordHash');
        });
        it('should throw UnauthorizedException for invalid token', async () => {
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            await expect(authService.me('invalid-token')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map