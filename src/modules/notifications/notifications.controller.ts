import { Controller, Post, Get, Patch, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceDto } from '../../dtos/device.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register-device')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Register a device for push notifications' })
  @ApiResponse({ status: 201, description: 'Device registered.' })
  async registerDevice(@Request() req, @Body() registerDeviceDto: RegisterDeviceDto) {
    return this.notificationsService.registerDevice(
      req.user.id,
      registerDeviceDto.platform,
      registerDeviceDto.pushToken,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get own notifications' })
  @ApiResponse({ status: 200, description: 'Notifications returned.' })
  async getMyNotifications(@Request() req, @Query() query: PaginatedQueryDto) {
    return this.notificationsService.getNotifications(req.user.id, query);
  }

  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @ApiOperation({ summary: 'Send a notification to a user (admin only)' })
  @ApiResponse({ status: 201, description: 'Notification sent.' })
  async sendNotification(@Body() body: { userId: string; title: string; message: string; type?: string }) {
    return this.notificationsService.sendNotification({
      user: { connect: { id: body.userId } },
      title: body.title,
      body: body.message,
      type: (body.type as any) || 'SYSTEM',
    });
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
