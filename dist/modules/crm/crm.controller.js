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
exports.CrmController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const crm_service_1 = require("./crm.service");
let CrmController = class CrmController {
    crmService;
    constructor(crmService) {
        this.crmService = crmService;
    }
    async getCustomers(merchantId, minPoints, maxPoints, minVisits, level, status, joinedAfter, joinedBefore) {
        return this.crmService.getCustomers(merchantId, {
            minPoints: minPoints ? parseInt(minPoints) : undefined,
            maxPoints: maxPoints ? parseInt(maxPoints) : undefined,
            minVisits: minVisits ? parseInt(minVisits) : undefined,
            level,
            status,
            joinedAfter,
            joinedBefore,
        });
    }
    async getSegments(merchantId) {
        return this.crmService.getSegments(merchantId);
    }
    async getTimeline(customerId, merchantId) {
        return this.crmService.getCustomerTimeline(customerId, merchantId);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)('customers/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers with filters' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('minPoints')),
    __param(2, (0, common_1.Query)('maxPoints')),
    __param(3, (0, common_1.Query)('minVisits')),
    __param(4, (0, common_1.Query)('level')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('joinedAfter')),
    __param(7, (0, common_1.Query)('joinedBefore')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getCustomers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)('segments/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer segments' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getSegments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)('timeline/:customerId/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer timeline' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CrmController.prototype, "getTimeline", null);
exports.CrmController = CrmController = __decorate([
    (0, swagger_1.ApiTags)('CRM'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('crm'),
    __metadata("design:paramtypes", [crm_service_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map