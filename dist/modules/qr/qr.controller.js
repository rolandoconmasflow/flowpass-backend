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
exports.QrController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const qr_service_1 = require("./qr.service");
const visits_service_1 = require("../visits/visits.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let QrController = class QrController {
    qrService;
    visitsService;
    constructor(qrService, visitsService) {
        this.qrService = qrService;
        this.visitsService = visitsService;
    }
    async getQRInfo(code) {
        return this.qrService.getQRInfo(code);
    }
    async checkIn(code, req) {
        return this.visitsService.checkIn(req.user.id, code);
    }
    async regenerateQr(id) {
        return this.qrService.regenerateQR(id);
    }
};
exports.QrController = QrController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get QR code information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR info returned.' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrController.prototype, "getQRInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CUSTOMER),
    (0, common_1.Post)(':code/check-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Check in using QR code (CUSTOMER only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Check-in recorded.' }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QrController.prototype, "checkIn", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)(':id/regenerate'),
    (0, swagger_1.ApiOperation)({ summary: 'Regenerate QR code (staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'QR regenerated.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrController.prototype, "regenerateQr", null);
exports.QrController = QrController = __decorate([
    (0, swagger_1.ApiTags)('QR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('qr'),
    __metadata("design:paramtypes", [qr_service_1.QrService,
        visits_service_1.VisitsService])
], QrController);
//# sourceMappingURL=qr.controller.js.map