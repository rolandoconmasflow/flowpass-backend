import { VisitSource } from '@prisma/client';
export declare class CreateVisitDto {
    customerId?: string;
    merchantId?: string;
    locationId?: string;
    qrCodeId?: string;
    membershipId?: string;
    source?: VisitSource;
}
