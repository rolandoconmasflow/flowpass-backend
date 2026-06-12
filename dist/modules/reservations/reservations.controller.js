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
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const reservations_service_1 = require("./reservations.service");
const reservations_dto_1 = require("./dto/reservations.dto");
let ReservationsController = class ReservationsController {
    reservationsService;
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    async getTables(merchantId) {
        return this.reservationsService.getTables(merchantId);
    }
    async createTable(dto) {
        return this.reservationsService.createTable(dto);
    }
    async updateTable(id, dto) {
        return this.reservationsService.updateTable(id, dto);
    }
    async deleteTable(id) {
        return this.reservationsService.deleteTable(id);
    }
    async getAvailableSlots(query) {
        return this.reservationsService.getAvailableSlots(query.merchantId, query.date);
    }
    async getMerchantReservations(merchantId, date) {
        return this.reservationsService.getMerchantReservations(merchantId, date);
    }
    async updateStatus(id, dto) {
        return this.reservationsService.updateStatus(id, dto);
    }
    async getMyReservations(req) {
        return this.reservationsService.getMyReservations(req.user.id);
    }
    async createReservation(req, dto) {
        return this.reservationsService.createReservation(dto, req.user.id);
    }
    async cancelMyReservation(req, id) {
        return this.reservationsService.cancelMyReservation(id, req.user.id);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Get)('tables/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tables for a merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tables returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getTables", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)('tables'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a table' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Table created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reservations_dto_1.CreateTableDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "createTable", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)('tables/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Table updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reservations_dto_1.UpdateTableDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "updateTable", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)('tables/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Table deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "deleteTable", null);
__decorate([
    (0, common_1.Get)('available-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for a merchant on a date (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available slots returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reservations_dto_1.AvailableSlotsQueryDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getAvailableSlots", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reservations for a merchant (optionally filter by date)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reservations returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getMerchantReservations", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reservation status (confirm, cancel, complete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reservations_dto_1.UpdateReservationStatusDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my reservations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'My reservations returned.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getMyReservations", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a reservation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reservation created.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reservations_dto_1.CreateReservationDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "createReservation", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel my reservation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reservation cancelled.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "cancelMyReservation", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, swagger_1.ApiTags)('Reservations'),
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map