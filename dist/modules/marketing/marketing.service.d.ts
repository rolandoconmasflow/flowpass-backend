import { PrismaService } from '../database/prisma.service';
export declare class MarketingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    joinWaitlist(email: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        email: string;
        createdAt: Date;
    }, unknown> & {}>;
}
