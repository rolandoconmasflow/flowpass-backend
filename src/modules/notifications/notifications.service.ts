import { Injectable } from '@nestjs/common';
import { Prisma, DevicePlatform } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PaginatedQueryDto, PaginatedResult } from '../../dtos/paginated.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async registerDevice(userId: string, platform: DevicePlatform, pushToken: string) {
    // Verificar si el dispositivo ya está registrado para este usuario
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        userId,
        pushToken,
      },
    });

    if (existingDevice) {
      // Si ya existe, actualizar la fecha
      return this.prisma.device.update({
        where: { id: existingDevice.id },
        data: { updatedAt: new Date() },
      });
    }

    // Si no existe, crear uno nuevo
    return this.prisma.device.create({
      data: {
        userId,
        platform,
        pushToken,
      },
    });
  }

  async getNotifications(userId: string, query?: PaginatedQueryDto, extraConditions: Prisma.NotificationWhereInput = {}) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where: Prisma.NotificationWhereInput = { userId, ...extraConditions };
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({ where, orderBy: { sentAt: 'desc' }, skip, take: limit }),
      this.prisma.notification.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async markAsRead(notificationId: string) {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() }
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId: userId,
        readAt: null
      },
      data: { readAt: new Date() }
    });
    
    return { count: result.count };
  }

  async createNotification(data: Prisma.NotificationCreateInput) {
    return await this.prisma.notification.create({
      data: {
        ...data,
        sentAt: new Date()
      }
    });
  }

  async createManyNotifications(notifications: Prisma.NotificationCreateManyInput[]) {
    const created = await this.prisma.notification.createMany({
      data: notifications.map(notification => ({
        ...notification,
        sentAt: new Date()
      }))
    });
    
    return created;
  }

  async findAllByUserId(userId: string, query?: PaginatedQueryDto) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;
    const where = { userId };
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({ where, orderBy: { sentAt: 'desc' }, skip, take: limit }),
      this.prisma.notification.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async sendNotification(notificationData: Prisma.NotificationCreateInput) {
    return await this.prisma.notification.create({
      data: {
        ...notificationData,
        sentAt: new Date()
      }
    });
  }
}