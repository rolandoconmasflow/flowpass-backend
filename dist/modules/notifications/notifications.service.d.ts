import { Prisma, DevicePlatform } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    registerDevice(userId: string, platform: DevicePlatform, pushToken: string): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        userId: string;
        platform: DevicePlatform;
        pushToken: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getNotifications(userId: string, query?: PaginatedQueryDto, extraConditions?: Prisma.NotificationWhereInput): Promise<PaginatedResult<import("@prisma/client/runtime/library").GetResult<{
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
    markAsRead(notificationId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    markAllAsRead(userId: string): Promise<{
        count: number;
    }>;
    createNotification(data: Prisma.NotificationCreateInput): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    createManyNotifications(notifications: Prisma.NotificationCreateManyInput[]): Promise<Prisma.BatchPayload>;
    findAllByUserId(userId: string, query?: PaginatedQueryDto): Promise<PaginatedResult<import("@prisma/client/runtime/library").GetResult<{
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
    sendNotification(notificationData: Prisma.NotificationCreateInput): Promise<import("@prisma/client/runtime/library").GetResult<{
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
