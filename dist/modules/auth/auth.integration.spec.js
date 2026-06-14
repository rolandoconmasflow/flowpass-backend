"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const bcrypt = require("bcrypt");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const prisma_service_1 = require("../database/prisma.service");
const mail_service_1 = require("../mail/mail.service");
describe('Auth (integration)', () => {
    let app;
    const mockUsersService = {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        sanitizeUser: jest.fn((u) => {
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
    const mockMailService = {
        sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
        sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
    };
    beforeAll(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [passport_1.PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [auth_controller_1.AuthController],
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
                { provide: mail_service_1.MailService, useValue: mockMailService },
            ],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
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
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
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
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@flowpass.com', password: 'wrongpass' })
                .expect(401);
        });
    });
});
//# sourceMappingURL=auth.integration.spec.js.map