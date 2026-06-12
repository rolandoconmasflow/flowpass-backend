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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const advanced_analytics_service_1 = require("./advanced-analytics.service");
let AdvancedAnalyticsController = class AdvancedAnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async retention(merchantId) {
        return this.analyticsService.getRetentionRate(merchantId);
    }
    async cohorts(merchantId) {
        return this.analyticsService.getCohortAnalysis(merchantId);
    }
    async economics(merchantId) {
        return this.analyticsService.getPointsEconomics(merchantId);
    }
    async dashboard(merchantId) {
        return this.analyticsService.getDashboard(merchantId);
    }
};
exports.AdvancedAnalyticsController = AdvancedAnalyticsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('retention/:merchantId'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get retention rate' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedAnalyticsController.prototype, "retention", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('cohorts/:merchantId'),
    (0, cache_manager_1.CacheTTL)(600),
    (0, swagger_1.ApiOperation)({ summary: 'Get cohort analysis' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedAnalyticsController.prototype, "cohorts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('economics/:merchantId'),
    (0, cache_manager_1.CacheTTL)(300),
    (0, swagger_1.ApiOperation)({ summary: 'Get points economics' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedAnalyticsController.prototype, "economics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('dashboard/:merchantId'),
    (0, cache_manager_1.CacheTTL)(120),
    (0, swagger_1.ApiOperation)({ summary: 'Get full analytics dashboard' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvancedAnalyticsController.prototype, "dashboard", null);
exports.AdvancedAnalyticsController = AdvancedAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [advanced_analytics_service_1.AdvancedAnalyticsService])
], AdvancedAnalyticsController);
//# sourceMappingURL=advanced-analytics.controller.js.map