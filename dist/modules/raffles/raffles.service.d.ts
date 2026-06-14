import { PrismaService } from '../database/prisma.service';
import { CreateRaffleDto, UpdateRaffleDto } from './dto/raffle.dto';
export declare class RafflesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(data: CreateRaffleDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        startsAt: Date | null;
        endsAt: Date | null;
        drawnAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findByMerchant(merchantId: string): Promise<({
        _count: {
            entries: number;
            winners: number;
        };
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        startsAt: Date | null;
        endsAt: Date | null;
        drawnAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    findById(id: string): Promise<{
        entries: ({
            customer: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                userId: string;
                displayName: string | null;
                birthday: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            raffleId: string;
            customerId: string;
            entries: number;
            createdAt: Date;
        }, unknown> & {})[];
        winners: ({
            customer: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                userId: string;
                displayName: string | null;
                birthday: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            raffleId: string;
            customerId: string;
            position: number;
            claimedAt: Date | null;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        startsAt: Date | null;
        endsAt: Date | null;
        drawnAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    update(id: string, data: UpdateRaffleDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        startsAt: Date | null;
        endsAt: Date | null;
        drawnAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    delete(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        startsAt: Date | null;
        endsAt: Date | null;
        drawnAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    enterRaffle(raffleId: string, customerId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        raffleId: string;
        customerId: string;
        entries: number;
        createdAt: Date;
    }, unknown> & {}>;
    drawWinners(raffleId: string, count?: number): Promise<({
        winners: ({
            customer: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                userId: string;
                displayName: string | null;
                birthday: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            raffleId: string;
            customerId: string;
            position: number;
            claimedAt: Date | null;
        }, unknown> & {})[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        title: string;
        description: string | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        startsAt: Date | null;
        endsAt: Date | null;
        drawnAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}) | null>;
    getActiveRafflesForCustomer(customerId: string): Promise<{
        hasEntered: boolean;
        entries: undefined;
        _count: {
            entries: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        merchantId: string;
        title: string;
        isActive: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        prize: string;
        prizeImage: string | null;
        entryCost: number;
        maxEntries: number | null;
        drawnAt: Date | null;
    }[]>;
}
