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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registerDevice(userId, platform, pushToken) {
        const existingDevice = await this.prisma.device.findFirst({
            where: {
                userId,
                pushToken,
            },
        });
        if (existingDevice) {
            return this.prisma.device.update({
                where: { id: existingDevice.id },
                data: { updatedAt: new Date() },
            });
        }
        return this.prisma.device.create({
            data: {
                userId,
                platform,
                pushToken,
            },
        });
    }
    async getNotifications(userId, query, extraConditions = {}) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { userId, ...extraConditions };
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({ where, orderBy: { sentAt: 'desc' }, skip, take: limit }),
            this.prisma.notification.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async markAsRead(notificationId) {
        return await this.prisma.notification.update({
            where: { id: notificationId },
            data: { readAt: new Date() }
        });
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: {
                userId: userId,
                readAt: null
            },
            data: { readAt: new Date() }
        });
        return { count: result.count };
    }
    async createNotification(data) {
        return await this.prisma.notification.create({
            data: {
                ...data,
                sentAt: new Date()
            }
        });
    }
    async createManyNotifications(notifications) {
        const created = await this.prisma.notification.createMany({
            data: notifications.map(notification => ({
                ...notification,
                sentAt: new Date()
            }))
        });
        return created;
    }
    async findAllByUserId(userId, query) {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;
        const where = { userId };
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({ where, orderBy: { sentAt: 'desc' }, skip, take: limit }),
            this.prisma.notification.count({ where }),
        ]);
        return new paginated_dto_1.PaginatedResult(data, total, page, limit);
    }
    async sendNotification(notificationData) {
        return await this.prisma.notification.create({
            data: {
                ...notificationData,
                sentAt: new Date()
            }
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map