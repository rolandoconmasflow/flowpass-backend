import { LocationsService } from './locations.service';
import { QrService } from '../qr/qr.service';
import { CreateLocationDto, UpdateLocationDto } from '../../dtos/location.dto';
export declare class LocationsController {
    private readonly locationsService;
    private readonly qrService;
    constructor(locationsService: LocationsService, qrService: QrService);
    findAll(): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {})[]>;
    findNearby(lat: string, lng: string, radius?: string): Promise<{
        distance: number;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        merchantId: string;
        address: string | null;
        city: string | null;
        country: string | null;
        latitude: number | null;
        longitude: number | null;
        openingHours: import("@prisma/client").Prisma.JsonValue;
    }[]>;
    findOne(id: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}) | null>;
    create(createLocationDto: CreateLocationDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    generateQr(id: string): Promise<{
        code: string;
        publicUrl: string;
        qrImageDataUrl: string | null;
        locationId: string;
        merchantId: string;
    }>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
    remove(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    }, unknown> & {}>;
}
