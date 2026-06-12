import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendPushNotification(token: string, title: string, body: string, data?: NotificationData) {
    try {
      const { Expo } = await import('expo-server-sdk');
      const expo = new Expo();

      if (!Expo.isExpoPushToken(token)) {
        this.logger.warn(`Invalid Expo push token: ${token}`);
        return { success: false, error: 'Invalid token' };
      }

      const message = {
        to: token,
        sound: 'default' as const,
        title,
        body,
        data: data || {},
      };

      const ticket = await expo.sendPushNotificationsAsync([message]);
      this.logger.log(`Push sent to ${token}: ${title}`);

      // Expo returns array of tickets
      const result = ticket[0];
      if (result?.status === 'error') {
        this.logger.error(`Push failed: ${result.message}`);
        return { success: false, error: result.message };
      }

      return { success: true, ticketId: result?.id || 'unknown' };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Error sending push: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  async sendPushToMultiple(tokens: string[], title: string, body: string, data?: NotificationData) {
    const results = await Promise.allSettled(
      tokens.map((token) => this.sendPushNotification(token, title, body, data)),
    );
    const sentCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    return { success: true, sentCount, total: tokens.length };
  }

  async sendToUser(userId: string, title: string, body: string, data?: NotificationData) {
    const devices = await this.prisma.device.findMany({
      where: { userId },
    });

    if (devices.length === 0) {
      this.logger.warn(`No devices for user ${userId}`);
      return { success: true, sentCount: 0 };
    }

    const tokens = devices.map((d) => d.pushToken);
    return this.sendPushToMultiple(tokens, title, body, data);
  }

  async sendToMerchantMembers(merchantId: string, title: string, body: string, data?: NotificationData) {
    const memberships = await this.prisma.membership.findMany({
      where: { merchantId, status: 'ACTIVE' },
      select: { customer: { select: { userId: true } } },
    });

    if (memberships.length === 0) {
      return { success: true, sentCount: 0 };
    }

    const userIds = [...new Set(memberships.map((m) => m.customer.userId))];
    const results = await Promise.allSettled(
      userIds.map((userId) => this.sendToUser(userId, title, body, data)),
    );
    const sentCount = results.filter((r) => r.status === 'fulfilled').length;
    return { success: true, sentCount, total: userIds.length };
  }

  async sendPromotionNotificationToMemberships(membershipIds: string[], promotionData: PromotionData) {
    const memberships = await this.prisma.membership.findMany({
      where: { id: { in: membershipIds } },
      select: { customer: { select: { userId: true } } },
    });

    const userIds = [...new Set(memberships.map((m) => m.customer.userId))];
    const title = `Nueva promoción: ${promotionData.title || ''}`;
    const body = promotionData.description || 'Mirá esta promoción exclusiva';

    const results = await Promise.allSettled(
      userIds.map((userId) => this.sendToUser(userId, title, body, { promotionId: promotionData.id })),
    );
    const sentCount = results.filter((r) => r.status === 'fulfilled' && r.value.sentCount > 0).length;
    return { success: true, sentCount, total: userIds.length };
  }
}
