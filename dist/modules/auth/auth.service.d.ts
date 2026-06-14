import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
type RegisterInput = {
    email: string;
    password: string;
    name?: string;
    role?: string;
};
type LoginInput = {
    email: string;
    password: string;
};
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly prisma;
    private readonly mailService;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService, mailService: MailService);
    private signToken;
    registerUser(userData: RegisterInput): Promise<{
        user: {
            [x: string]: unknown;
        };
        access_token: string;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
    }): Promise<{
        [x: string]: unknown;
    }>;
    login(loginData: LoginInput): Promise<{
        user: {
            [x: string]: unknown;
        };
        access_token: string;
        activeMerchantId: string | null;
    }>;
    me(token: string): Promise<{
        [x: string]: unknown;
    }>;
    signTokenWithMerchant(userId: string, activeMerchantId: string): Promise<string>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
export {};
