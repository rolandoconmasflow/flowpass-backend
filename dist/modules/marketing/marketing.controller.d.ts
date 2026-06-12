import { MarketingService } from './marketing.service';
declare class WaitlistDto {
    email: string;
}
export declare class MarketingController {
    private readonly marketingService;
    constructor(marketingService: MarketingService);
    joinWaitlist(dto: WaitlistDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        email: string;
        createdAt: Date;
    }, unknown> & {}>;
}
export {};
