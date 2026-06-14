import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let _usersService: UsersService;
  let _jwtService: JwtService;

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
    sanitizeUser: jest.fn((user: any) => {
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    _usersService = module.get<UsersService>(UsersService);
    _jwtService = module.get<JwtService>(JwtService);

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

      await expect(
        authService.registerUser({
          email: 'test@flowpass.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

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
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.login({
          email: 'test@flowpass.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@flowpass.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
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

      await expect(authService.me('invalid-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});
