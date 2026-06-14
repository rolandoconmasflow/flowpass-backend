"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./modules/database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const merchants_module_1 = require("./modules/merchants/merchants.module");
const locations_module_1 = require("./modules/locations/locations.module");
const qr_module_1 = require("./modules/qr/qr.module");
const loyalty_module_1 = require("./modules/loyalty/loyalty.module");
const promotions_module_1 = require("./modules/promotions/promotions.module");
const coupons_module_1 = require("./modules/coupons/coupons.module");
const visits_module_1 = require("./modules/visits/visits.module");
const wallet_module_1 = require("./modules/wallet/wallet.module");
const memberships_module_1 = require("./modules/memberships/memberships.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const levels_module_1 = require("./modules/levels/levels.module");
const achievements_module_1 = require("./modules/achievements/achievements.module");
const referrals_module_1 = require("./modules/referrals/referrals.module");
const missions_module_1 = require("./modules/missions/missions.module");
const raffles_module_1 = require("./modules/raffles/raffles.module");
const rewards_module_1 = require("./modules/rewards/rewards.module");
const crm_module_1 = require("./modules/crm/crm.module");
const pos_module_1 = require("./modules/pos/pos.module");
const ecommerce_module_1 = require("./modules/ecommerce/ecommerce.module");
const advanced_analytics_module_1 = require("./modules/analytics/advanced/advanced-analytics.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const staff_module_1 = require("./modules/staff/staff.module");
const health_module_1 = require("./modules/health/health.module");
const events_module_1 = require("./modules/events/events.module");
const logger_module_1 = require("./modules/logger/logger.module");
const menu_module_1 = require("./modules/menu/menu.module");
const marketing_module_1 = require("./modules/marketing/marketing.module");
const reservations_module_1 = require("./modules/reservations/reservations.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const billing_module_1 = require("./modules/billing/billing.module");
const mail_module_1 = require("./modules/mail/mail.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            merchants_module_1.MerchantsModule,
            locations_module_1.LocationsModule,
            qr_module_1.QrModule,
            loyalty_module_1.LoyaltyModule,
            promotions_module_1.PromotionsModule,
            coupons_module_1.CouponsModule,
            visits_module_1.VisitsModule,
            wallet_module_1.WalletModule,
            memberships_module_1.MembershipsModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            levels_module_1.LevelsModule,
            achievements_module_1.AchievementsModule,
            referrals_module_1.ReferralsModule,
            missions_module_1.MissionsModule,
            raffles_module_1.RafflesModule,
            rewards_module_1.RewardsModule,
            crm_module_1.CrmModule,
            pos_module_1.PosModule,
            ecommerce_module_1.EcommerceModule,
            advanced_analytics_module_1.AdvancedAnalyticsModule,
            dashboard_module_1.DashboardModule,
            staff_module_1.StaffModule,
            health_module_1.HealthModule,
            events_module_1.EventsModule,
            menu_module_1.MenuModule,
            marketing_module_1.MarketingModule,
            reservations_module_1.ReservationsModule,
            uploads_module_1.UploadsModule,
            logger_module_1.LoggerModule,
            billing_module_1.BillingModule,
            mail_module_1.MailModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map