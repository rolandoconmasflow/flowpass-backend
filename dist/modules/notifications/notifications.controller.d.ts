import { NotificationsService } from './notifications.service';
import { RegisterDeviceDto } from '../../dtos/device.dto';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    registerDevice(req: any, registerDeviceDto: RegisterDeviceDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        platform: import("@prisma/client").DevicePlatform;
        pushToken: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getMyNotifications(req: any, query: PaginatedQueryDto): Promise<import("../../dtos/paginated.dto").PaginatedResult<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        merchantId: string | null;
        title: string;
        body: string;
        type: import("@prisma/client").NotificationType;
        sentAt: Date | null;
        readAt: Date | null;
        createdAt: Date;
    }, unknown> & {}>>;
    sendNotification(body: {
        userId: string;
        title: string;
        message: string;
        type?: string;
    }): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        merchantId: string | null;
        title: string;
        body: string;
        type: import("@prisma/client").NotificationType;
        sentAt: Date | null;
        readAt: Date | null;
        createdAt: Date;
    }, unknown> & {}>;
    markAsRead(id: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        merchantId: string | null;
        title: string;
        body: string;
        type: import("@prisma/client").NotificationType;
        sentAt: Date | null;
        readAt: Date | null;
        createdAt: Date;
    }, unknown> & {}>;
}
