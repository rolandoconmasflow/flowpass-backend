import { PrismaService } from '../database/prisma.service';
export declare class QrService {
    private prisma;
    constructor(prisma: PrismaService);
    generateQRForLocation(locationId: string): Promise<{
        code: string;
        publicUrl: string;
        qrImageDataUrl: string | null;
        locationId: string;
        merchantId: string;
    }>;
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
    generateQrCodeDataUrl(text: string): Promise<string>;
    regenerateQR(id: string): Promise<{
        id: string;
        code: string;
        regenerated: boolean;
        message: string;
    }>;
}
