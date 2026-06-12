import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto, UpdateEventDto, PurchaseTicketDto } from './dto/event.dto';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';
export declare class EventsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findCustomerProfile(userId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        displayName: string | null;
        birthday: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}) | null>;
    create(dto: CreateEventDto): Promise<{
        merchant: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            levelsEnabled: boolean;
            commissionRate: number | null;
            stripeAccountId: string | null;
            ownerId: string;
            category: import("@prisma/client").MerchantCategory;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        location: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            openingHours: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        locationId: string | null;
        title: string;
        description: string | null;
        imageUrl: string | null;
        category: import("@prisma/client").EventCategory;
        ticketPrice: Prisma.Decimal;
        capacity: number;
        availableSeats: number;
        saleStartsAt: Date | null;
        saleEndsAt: Date | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    findByMerchant(merchantId: string, query?: PaginatedQueryDto): Promise<PaginatedResult<{
        location: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            openingHours: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
        _count: {
            tickets: number;
        };
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        locationId: string | null;
        title: string;
        description: string | null;
        imageUrl: string | null;
        category: import("@prisma/client").EventCategory;
        ticketPrice: Prisma.Decimal;
        capacity: number;
        availableSeats: number;
        saleStartsAt: Date | null;
        saleEndsAt: Date | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>>;
    findById(id: string): Promise<{
        merchant: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            levelsEnabled: boolean;
            commissionRate: number | null;
            stripeAccountId: string | null;
            ownerId: string;
            category: import("@prisma/client").MerchantCategory;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        location: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            openingHours: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
        _count: {
            tickets: number;
        };
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        locationId: string | null;
        title: string;
        description: string | null;
        imageUrl: string | null;
        category: import("@prisma/client").EventCategory;
        ticketPrice: Prisma.Decimal;
        capacity: number;
        availableSeats: number;
        saleStartsAt: Date | null;
        saleEndsAt: Date | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    update(id: string, dto: UpdateEventDto): Promise<{
        merchant: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            name: string;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            levelsEnabled: boolean;
            commissionRate: number | null;
            stripeAccountId: string | null;
            ownerId: string;
            category: import("@prisma/client").MerchantCategory;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        location: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            openingHours: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        locationId: string | null;
        title: string;
        description: string | null;
        imageUrl: string | null;
        category: import("@prisma/client").EventCategory;
        ticketPrice: Prisma.Decimal;
        capacity: number;
        availableSeats: number;
        saleStartsAt: Date | null;
        saleEndsAt: Date | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    delete(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        locationId: string | null;
        title: string;
        description: string | null;
        imageUrl: string | null;
        category: import("@prisma/client").EventCategory;
        ticketPrice: Prisma.Decimal;
        capacity: number;
        availableSeats: number;
        saleStartsAt: Date | null;
        saleEndsAt: Date | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    listPublicEvents(query?: PaginatedQueryDto): Promise<PaginatedResult<{
        merchant: {
            name: string;
            logoUrl: string | null;
        };
        location: (import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            name: string;
            address: string | null;
            city: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            openingHours: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        locationId: string | null;
        title: string;
        description: string | null;
        imageUrl: string | null;
        category: import("@prisma/client").EventCategory;
        ticketPrice: Prisma.Decimal;
        capacity: number;
        availableSeats: number;
        saleStartsAt: Date | null;
        saleEndsAt: Date | null;
        startsAt: Date | null;
        endsAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>>;
    getMyTickets(customerId: string): Promise<({
        event: {
            merchant: {
                name: string;
                logoUrl: string | null;
            };
            location: (import("@prisma/client/runtime/library").GetResult<{
                id: string;
                merchantId: string;
                name: string;
                address: string | null;
                city: string | null;
                country: string | null;
                latitude: number | null;
                longitude: number | null;
                openingHours: Prisma.JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {}) | null;
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            locationId: string | null;
            title: string;
            description: string | null;
            imageUrl: string | null;
            category: import("@prisma/client").EventCategory;
            ticketPrice: Prisma.Decimal;
            capacity: number;
            availableSeats: number;
            saleStartsAt: Date | null;
            saleEndsAt: Date | null;
            startsAt: Date | null;
            endsAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        eventId: string;
        customerId: string;
        code: string;
        status: import("@prisma/client").TicketStatus;
        purchaseDate: Date;
        usedAt: Date | null;
        usedBy: string | null;
        paymentRef: string | null;
        paymentAmount: Prisma.Decimal | null;
        commissionAmount: Prisma.Decimal | null;
        customerEmail: string | null;
        createdAt: Date;
    }, unknown> & {})[]>;
    purchaseTicket(customerId: string, dto: PurchaseTicketDto): Promise<{
        ticket: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            eventId: string;
            customerId: string;
            code: string;
            status: import("@prisma/client").TicketStatus;
            purchaseDate: Date;
            usedAt: Date | null;
            usedBy: string | null;
            paymentRef: string | null;
            paymentAmount: Prisma.Decimal | null;
            commissionAmount: Prisma.Decimal | null;
            customerEmail: string | null;
            createdAt: Date;
        }, unknown> & {};
        qrDataUrl: string;
        event: {
            title: string;
            startsAt: Date | null;
            merchant: string;
        };
    }>;
    getEventTickets(eventId: string, query: PaginatedQueryDto): Promise<PaginatedResult<{
        customer: {
            user: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                email: string | null;
                phone: string | null;
                passwordHash: string | null;
                name: string | null;
                role: import("@prisma/client").UserRole;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            userId: string;
            displayName: string | null;
            birthday: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
        event: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            locationId: string | null;
            title: string;
            description: string | null;
            imageUrl: string | null;
            category: import("@prisma/client").EventCategory;
            ticketPrice: Prisma.Decimal;
            capacity: number;
            availableSeats: number;
            saleStartsAt: Date | null;
            saleEndsAt: Date | null;
            startsAt: Date | null;
            endsAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        eventId: string;
        customerId: string;
        code: string;
        status: import("@prisma/client").TicketStatus;
        purchaseDate: Date;
        usedAt: Date | null;
        usedBy: string | null;
        paymentRef: string | null;
        paymentAmount: Prisma.Decimal | null;
        commissionAmount: Prisma.Decimal | null;
        customerEmail: string | null;
        createdAt: Date;
    }, unknown> & {}>>;
    validateTicket(code: string, staffUserId: string): Promise<{
        ticket: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            eventId: string;
            customerId: string;
            code: string;
            status: import("@prisma/client").TicketStatus;
            purchaseDate: Date;
            usedAt: Date | null;
            usedBy: string | null;
            paymentRef: string | null;
            paymentAmount: Prisma.Decimal | null;
            commissionAmount: Prisma.Decimal | null;
            customerEmail: string | null;
            createdAt: Date;
        }, unknown> & {};
        event: string;
        customer: string | null;
        validatedAt: Date;
    }>;
    getEventDashboard(eventId: string): Promise<{
        eventId: string;
        title: string;
        capacity: number;
        availableSeats: number;
        totalSold: number;
        totalUsed: number;
        totalCancelled: number;
        totalRevenue: number | Prisma.Decimal;
        occupancyRate: number;
    }>;
    getMerchantEventsDashboard(merchantId: string): Promise<{
        events: ({
            _count: {
                tickets: number;
            };
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            merchantId: string;
            locationId: string | null;
            title: string;
            description: string | null;
            imageUrl: string | null;
            category: import("@prisma/client").EventCategory;
            ticketPrice: Prisma.Decimal;
            capacity: number;
            availableSeats: number;
            saleStartsAt: Date | null;
            saleEndsAt: Date | null;
            startsAt: Date | null;
            endsAt: Date | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {})[];
        totalEvents: number;
        totalRevenue: number | Prisma.Decimal;
    }>;
}
