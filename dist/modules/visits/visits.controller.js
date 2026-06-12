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
exports.VisitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const visits_service_1 = require("./visits.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const checkin_dto_1 = require("../../dtos/checkin.dto");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let VisitsController = class VisitsController {
    visitsService;
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    async checkIn(checkInDto, req) {
        return this.visitsService.checkIn(req.user.id, checkInDto.code);
    }
    async getCustomerVisits(customerId, req, pagination) {
        const isStaffOrAbove = req.user.role === 'SUPER_ADMIN' || req.user.role === 'MERCHANT_OWNER' || req.user.role === 'MERCHANT_STAFF';
        if (!isStaffOrAbove) {
            const ownProfile = await this.visitsService.findCustomerProfileByUserId(req.user.id);
            if (!ownProfile || ownProfile.id !== customerId) {
                throw new common_1.ForbiddenException('You do not have permission to view these visits');
            }
        }
        return this.visitsService.getVisitsByCustomer(customerId, pagination);
    }
    async getVisitsByMerchant(merchantId, pagination) {
        return this.visitsService.getVisitsByMerchant(merchantId, pagination);
    }
};
exports.VisitsController = VisitsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('check-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Check in with QR code' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Check-in recorded.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkin_dto_1.CheckInDto, Object]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get visits by customer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visits returned.' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "getCustomerVisits", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get visits by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visits returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "getVisitsByMerchant", null);
exports.VisitsController = VisitsController = __decorate([
    (0, swagger_1.ApiTags)('Visits'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('visits'),
    __metadata("design:paramtypes", [visits_service_1.VisitsService])
], VisitsController);
//# sourceMappingURL=visits.controller.js.map