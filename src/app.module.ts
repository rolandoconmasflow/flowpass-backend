import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { LocationsModule } from './modules/locations/locations.module';
import { QrModule } from './modules/qr/qr.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { VisitsModule } from './modules/visits/visits.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { LevelsModule } from './modules/levels/levels.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { MissionsModule } from './modules/missions/missions.module';
import { RafflesModule } from './modules/raffles/raffles.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { CrmModule } from './modules/crm/crm.module';
import { PosModule } from './modules/pos/pos.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';
import { AdvancedAnalyticsModule } from './modules/analytics/advanced/advanced-analytics.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { StaffModule } from './modules/staff/staff.module';
import { HealthModule } from './modules/health/health.module';
import { EventsModule } from './modules/events/events.module';
import { LoggerModule } from './modules/logger/logger.module';
import { MenuModule } from './modules/menu/menu.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    MerchantsModule,
    LocationsModule,
    QrModule,
    LoyaltyModule,
    PromotionsModule,
    CouponsModule,
    VisitsModule,
    WalletModule,
    MembershipsModule,
    NotificationsModule,
    AnalyticsModule,
    LevelsModule,
    AchievementsModule,
    ReferralsModule,
    MissionsModule,
    RafflesModule,
    RewardsModule,
    CrmModule,
    PosModule,
    EcommerceModule,
    AdvancedAnalyticsModule,
    DashboardModule,
    StaffModule,
    HealthModule,
    EventsModule,
    MenuModule,
    MarketingModule,
    ReservationsModule,
    UploadsModule,
    LoggerModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
