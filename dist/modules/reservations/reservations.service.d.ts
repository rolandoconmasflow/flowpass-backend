import { ReservationStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateTableDto, UpdateTableDto, CreateReservationDto, UpdateReservationStatusDto } from './dto/reservations.dto';
export declare class ReservationsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getTables(merchantId: string): Promise<({
        reservations: {
            id: string;
            date: Date;
            timeSlot: string;
            guests: number;
            status: ReservationStatus;
            customerName: string | null;
        }[];
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        label: string;
        capacity: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    createTable(dto: CreateTableDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        label: string;
        capacity: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    updateTable(id: string, dto: UpdateTableDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        label: string;
        capacity: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    deleteTable(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        label: string;
        capacity: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getMerchantReservations(merchantId: string, date?: string): Promise<({
        table: {
            id: string;
            label: string;
        } | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        customerId: string;
        tableId: string | null;
        date: Date;
        timeSlot: string;
        guests: number;
        status: ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getMyReservations(customerId: string): Promise<({
        merchant: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string | null;
        };
        table: {
            id: string;
            label: string;
        } | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        customerId: string;
        tableId: string | null;
        date: Date;
        timeSlot: string;
        guests: number;
        status: ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getAvailableSlots(merchantId: string, date: string): Promise<Record<string, {
        tableId: string;
        label: string;
        capacity: number;
    }[]>>;
    createReservation(dto: CreateReservationDto, customerId: string): Promise<{
        table: {
            id: string;
            label: string;
        } | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        customerId: string;
        tableId: string | null;
        date: Date;
        timeSlot: string;
        guests: number;
        status: ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    updateStatus(id: string, dto: UpdateReservationStatusDto): Promise<{
        table: {
            id: string;
            label: string;
        } | null;
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        customerId: string;
        tableId: string | null;
        date: Date;
        timeSlot: string;
        guests: number;
        status: ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    cancelMyReservation(id: string, customerId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        customerId: string;
        tableId: string | null;
        date: Date;
        timeSlot: string;
        guests: number;
        status: ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
