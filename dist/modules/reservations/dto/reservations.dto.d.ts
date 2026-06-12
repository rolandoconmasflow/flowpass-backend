import { ReservationStatus } from '@prisma/client';
export declare class CreateTableDto {
    merchantId: string;
    label: string;
    capacity: number;
}
export declare class UpdateTableDto {
    label?: string;
    capacity?: number;
    isActive?: boolean;
}
export declare class CreateReservationDto {
    merchantId: string;
    customerId: string;
    tableId?: string;
    date: string;
    timeSlot: string;
    guests: number;
    notes?: string;
    customerName?: string;
    customerPhone?: string;
}
export declare class UpdateReservationStatusDto {
    status: ReservationStatus;
}
export declare class AvailableSlotsQueryDto {
    merchantId: string;
    date: string;
}
