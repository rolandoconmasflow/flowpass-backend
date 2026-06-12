import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AdvancedAnalyticsController } from './advanced-analytics.controller';
import { AdvancedAnalyticsService } from './advanced-analytics.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 5,
      max: 100,
    }),
  ],
  controllers: [AdvancedAnalyticsController],
  providers: [AdvancedAnalyticsService],
  exports: [AdvancedAnalyticsService],
})
export class AdvancedAnalyticsModule {}
