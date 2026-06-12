import { QrService } from './qr.service';
import { VisitsService } from '../visits/visits.service';
import { RequestWithUser } from '../auth/request-with-user.interface';
export declare class QrController {
    private readonly qrService;
    private readonly visitsService;
    constructor(qrService: QrService, visitsService: VisitsService);
    getQRInfo(code: string): Promise<{
        merchant: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
        };
        location: {
            id: string | null;
            name: string;
            address: string | null;
            city: string | null;
        };
        qr: {
            active: boolean;
        };
    }>;
    checkIn(code: string, req: RequestWithUser): Promise<{
        message: string;
        visit: {
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
                openingHours: import("@prisma/client").Prisma.JsonValue | null;
                createdAt: Date;
                updatedAt: Date;
            }, unknown> & {}) | null;
            membership: import("@prisma/client/runtime/library").GetResult<{
                id: string;
                customerId: string;
                merchantId: string;
                loyaltyProgramId: string | null;
                points: number;
                visitsCount: number;
                status: import("@prisma/client").MembershipStatus;
                level: string | null;
                levelId: string | null;
                joinedAt: Date;
                updatedAt: Date;
            }, unknown> & {};
        } & import("@prisma/client/runtime/library").GetResult<{
            id: string;
            membershipId: string;
            merchantId: string;
            locationId: string | null;
            customerId: string;
            source: import("@prisma/client").VisitSource;
            qrCodeId: string | null;
            createdAt: Date;
        }, unknown> & {};
        pointsAdded: number;
        totalPoints: number;
        totalVisits: number;
        membership: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            customerId: string;
            merchantId: string;
            loyaltyProgramId: string | null;
            points: number;
            visitsCount: number;
            status: import("@prisma/client").MembershipStatus;
            level: string | null;
            levelId: string | null;
            joinedAt: Date;
            updatedAt: Date;
        }, unknown> & {};
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
            openingHours: import("@prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {}) | null;
        levelUpgrade: {
            name: string;
            color: string | null;
        } | undefined;
        achievementsAwarded: string[] | undefined;
    }>;
    regenerateQr(id: string): Promise<{
        id: string;
        code: string;
        regenerated: boolean;
        message: string;
    }>;
}
