import { PrismaService } from '../database/prisma.service';
interface NotificationData {
    [key: string]: unknown;
}
interface PromotionData {
    id?: string;
    title?: string;
    description?: string;
    [key: string]: unknown;
}
export declare class PushNotificationsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    sendPushNotification(token: string, title: string, body: string, data?: NotificationData): Promise<{
        success: boolean;
        error: string;
        ticketId?: undefined;
    } | {
        success: boolean;
        ticketId: string;
        error?: undefined;
    }>;
    sendPushToMultiple(tokens: string[], title: string, body: string, data?: NotificationData): Promise<{
        success: boolean;
        sentCount: number;
        total: number;
    }>;
    sendToUser(userId: string, title: string, body: string, data?: NotificationData): Promise<{
        success: boolean;
        sentCount: number;
        total: number;
    } | {
        success: boolean;
        sentCount: number;
    }>;
    sendToMerchantMembers(merchantId: string, title: string, body: string, data?: NotificationData): Promise<{
        success: boolean;
        sentCount: number;
        total?: undefined;
    } | {
        success: boolean;
        sentCount: number;
        total: number;
    }>;
    sendPromotionNotificationToMemberships(membershipIds: string[], promotionData: PromotionData): Promise<{
        success: boolean;
        sentCount: number;
        total: number;
    }>;
}
export {};
