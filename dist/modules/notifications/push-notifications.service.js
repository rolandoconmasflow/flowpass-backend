"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PushNotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let PushNotificationsService = PushNotificationsService_1 = class PushNotificationsService {
    prisma;
    logger = new common_1.Logger(PushNotificationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendPushNotification(token, title, body, data) {
        try {
            const { Expo } = await Promise.resolve().then(() => require('expo-server-sdk'));
            const expo = new Expo();
            if (!Expo.isExpoPushToken(token)) {
                this.logger.warn(`Invalid Expo push token: ${token}`);
                return { success: false, error: 'Invalid token' };
            }
            const message = {
                to: token,
                sound: 'default',
                title,
                body,
                data: data || {},
            };
            const ticket = await expo.sendPushNotificationsAsync([message]);
            this.logger.log(`Push sent to ${token}: ${title}`);
            const result = ticket[0];
            if (result?.status === 'error') {
                this.logger.error(`Push failed: ${result.message}`);
                return { success: false, error: result.message };
            }
            return { success: true, ticketId: result?.id || 'unknown' };
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error(`Error sending push: ${err.message}`);
            return { success: false, error: err.message };
        }
    }
    async sendPushToMultiple(tokens, title, body, data) {
        const results = await Promise.allSettled(tokens.map((token) => this.sendPushNotification(token, title, body, data)));
        const sentCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
        return { success: true, sentCount, total: tokens.length };
    }
    async sendToUser(userId, title, body, data) {
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
    async sendToMerchantMembers(merchantId, title, body, data) {
        const memberships = await this.prisma.membership.findMany({
            where: { merchantId, status: 'ACTIVE' },
            select: { customer: { select: { userId: true } } },
        });
        if (memberships.length === 0) {
            return { success: true, sentCount: 0 };
        }
        const userIds = [...new Set(memberships.map((m) => m.customer.userId))];
        const results = await Promise.allSettled(userIds.map((userId) => this.sendToUser(userId, title, body, data)));
        const sentCount = results.filter((r) => r.status === 'fulfilled').length;
        return { success: true, sentCount, total: userIds.length };
    }
    async sendPromotionNotificationToMemberships(membershipIds, promotionData) {
        const memberships = await this.prisma.membership.findMany({
            where: { id: { in: membershipIds } },
            select: { customer: { select: { userId: true } } },
        });
        const userIds = [...new Set(memberships.map((m) => m.customer.userId))];
        const title = `Nueva promoción: ${promotionData.title || ''}`;
        const body = promotionData.description || 'Mirá esta promoción exclusiva';
        const results = await Promise.allSettled(userIds.map((userId) => this.sendToUser(userId, title, body, { promotionId: promotionData.id })));
        const sentCount = results.filter((r) => r.status === 'fulfilled' && r.value.sentCount > 0).length;
        return { success: true, sentCount, total: userIds.length };
    }
};
exports.PushNotificationsService = PushNotificationsService;
exports.PushNotificationsService = PushNotificationsService = PushNotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PushNotificationsService);
//# sourceMappingURL=push-notifications.service.js.map