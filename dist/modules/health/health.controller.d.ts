export declare class HealthController {
    private readonly logger;
    private readonly prisma;
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        checks: Record<string, string>;
    }>;
}
