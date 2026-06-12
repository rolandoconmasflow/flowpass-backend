import { RequestWithUser } from '../auth/request-with-user.interface';
import { ReservationsService } from './reservations.service';
import { CreateTableDto, UpdateTableDto, CreateReservationDto, UpdateReservationStatusDto, AvailableSlotsQueryDto } from './dto/reservations.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    getTables(merchantId: string): Promise<({
        reservations: {
            id: string;
            date: Date;
            timeSlot: string;
            guests: number;
            status: import("@prisma/client").ReservationStatus;
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
    getAvailableSlots(query: AvailableSlotsQueryDto): Promise<Record<string, {
        tableId: string;
        label: string;
        capacity: number;
    }[]>>;
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
        status: import("@prisma/client").ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
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
        status: import("@prisma/client").ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getMyReservations(req: RequestWithUser): Promise<({
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
        status: import("@prisma/client").ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    createReservation(req: RequestWithUser, dto: CreateReservationDto): Promise<{
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
        status: import("@prisma/client").ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    cancelMyReservation(req: RequestWithUser, id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        customerId: string;
        tableId: string | null;
        date: Date;
        timeSlot: string;
        guests: number;
        status: import("@prisma/client").ReservationStatus;
        notes: string | null;
        customerName: string | null;
        customerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
}
