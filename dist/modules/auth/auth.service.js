"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../database/prisma.service");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    signToken(user, activeMerchantId) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            activeMerchantId: activeMerchantId ?? null,
        };
        return this.jwtService.sign(payload);
    }
    async registerUser(userData) {
        const existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const user = await this.usersService.create({
            ...userData,
            name: userData.name || userData.email,
        });
        const sanitizedUser = this.usersService.sanitizeUser(user);
        return {
            user: sanitizedUser,
            access_token: this.signToken(user),
        };
    }
    async updateProfile(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { name: data.name },
        });
        return this.usersService.sanitizeUser(user);
    }
    async login(loginData) {
        const user = await this.usersService.findByEmail(loginData.email);
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        let activeMerchantId = null;
        if (user.role === 'MERCHANT_OWNER') {
            const firstMerchant = await this.prisma.merchant.findFirst({
                where: { ownerId: user.id },
                orderBy: { createdAt: 'asc' },
            });
            activeMerchantId = firstMerchant?.id ?? null;
        }
        return {
            user: this.usersService.sanitizeUser(user),
            access_token: this.signToken(user, activeMerchantId),
            activeMerchantId,
        };
    }
    async me(token) {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.usersService.findById(decoded.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.usersService.sanitizeUser(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async signTokenWithMerchant(userId, activeMerchantId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.signToken({ id: user.id, email: user.email, role: user.role }, activeMerchantId);
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return { message: 'Si el email existe, recibirás un link de recuperación.' };
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.passwordResetToken.create({
            data: { email, token, expiresAt },
        });
        return { message: 'Si el email existe, recibirás un link de recuperación.', token };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Token inválido o expirado');
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email: resetToken.email },
            data: { passwordHash: hash },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() },
        });
        return { message: 'Contraseña actualizada exitosamente.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map