import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PushNotificationsService } from './push-notifications.service';
import { NotificationsController } from './notifications.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NotificationsService, PushNotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService, PushNotificationsService],
})
export class NotificationsModule {}
