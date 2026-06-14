export declare class MailService {
    private readonly logger;
    private transporter;
    private from;
    constructor();
    private send;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendResetPasswordEmail(to: string, token: string): Promise<void>;
}
