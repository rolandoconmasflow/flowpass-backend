import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../database/prisma.service';

describe('Auth (integration)', () => {
  let app: INestApplication;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    sanitizeUser: jest.fn((u: any) => {
      const { passwordHash: _pw, ...rest } = u;
      return rest;
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-jwt-token'),
    verify: jest.fn(),
  };

  const mockPrismaService = {
    merchant: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user and return token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 'new-user',
        email: 'new@flowpass.com',
        name: 'New User',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'new@flowpass.com', password: 'StrongPass123', name: 'New User' })
        .expect(201);

      expect(res.body.access_token).toBe('test-jwt-token');
      expect(res.body.user.email).toBe('new@flowpass.com');
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'StrongPass123' })
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'existing', email: 'dup@flowpass.com' });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'dup@flowpass.com', password: 'StrongPass123' })
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@flowpass.com',
        passwordHash: '$2b$10$hashed',
        role: 'CUSTOMER',
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@flowpass.com', password: 'StrongPass123' })
        .expect(201);

      expect(res.body.access_token).toBe('test-jwt-token');
    });

    it('should return 401 for wrong password', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@flowpass.com',
        passwordHash: '$2b$10$hashed',
        role: 'CUSTOMER',
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@flowpass.com', password: 'wrongpass' })
        .expect(401);
    });
  });
});
