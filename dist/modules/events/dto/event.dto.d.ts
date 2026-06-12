import { EventCategory } from '@prisma/client';
export declare class CreateEventDto {
    merchantId: string;
    locationId?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    category?: EventCategory;
    ticketPrice?: number;
    capacity?: number;
    saleStartsAt?: string;
    saleEndsAt?: string;
    startsAt?: string;
    endsAt?: string;
}
export declare class UpdateEventDto {
    title?: string;
    description?: string;
    imageUrl?: string;
    category?: EventCategory;
    ticketPrice?: number;
    capacity?: number;
    saleStartsAt?: string;
    saleEndsAt?: string;
    startsAt?: string;
    endsAt?: string;
    isActive?: boolean;
}
export declare class PurchaseTicketDto {
    eventId: string;
    customerEmail?: string;
}
