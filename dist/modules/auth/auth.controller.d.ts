import { Response } from 'express';
import { AuthService } from './auth.service';
import { RequestWithUser } from './request-with-user.interface';
import { RegisterDto, LoginDto, UpdateProfileDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from '../../dtos/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerData: RegisterDto, res: Response): Promise<{
        user: {
            [x: string]: unknown;
        };
        access_token: string;
    }>;
    login(loginData: LoginDto, res: Response): Promise<{
        user: {
            [x: string]: unknown;
        };
        access_token: string;
        activeMerchantId: string | null;
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    me(req: RequestWithUser): Promise<{
        [key: string]: unknown;
        id: string;
        email: string;
        name?: string | null;
        role: string;
    }>;
    updateProfile(req: RequestWithUser, dto: UpdateProfileDto): Promise<{
        [x: string]: unknown;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
}
