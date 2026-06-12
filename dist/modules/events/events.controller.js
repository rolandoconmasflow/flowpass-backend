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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const subscription_guard_1 = require("../billing/subscription.guard");
const events_service_1 = require("./events.service");
const event_dto_1 = require("./dto/event.dto");
const paginated_dto_1 = require("../../dtos/paginated.dto");
let EventsController = class EventsController {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async create(dto) {
        return this.eventsService.create(dto);
    }
    async findByMerchant(merchantId, pagination) {
        return this.eventsService.findByMerchant(merchantId, pagination);
    }
    async findById(id) {
        return this.eventsService.findById(id);
    }
    async update(id, dto) {
        return this.eventsService.update(id, dto);
    }
    async delete(id) {
        return this.eventsService.delete(id);
    }
    async listPublicEvents(pagination) {
        return this.eventsService.listPublicEvents(pagination);
    }
    async getMyTickets(req) {
        const customerProfile = await this.eventsService.findCustomerProfile(req.user.id);
        if (!customerProfile)
            return { tickets: [] };
        return this.eventsService.getMyTickets(customerProfile.id);
    }
    async purchaseTicket(req, dto) {
        const customerProfile = await this.eventsService.findCustomerProfile(req.user.id);
        if (!customerProfile) {
            return { message: 'Customer profile not found' };
        }
        return this.eventsService.purchaseTicket(customerProfile.id, dto);
    }
    async validateTicket(code, req) {
        return this.eventsService.validateTicket(code, req.user.id);
    }
    async getEventTickets(eventId, pagination) {
        return this.eventsService.getEventTickets(eventId, pagination);
    }
    async getEventDashboard(eventId) {
        return this.eventsService.getEventDashboard(eventId);
    }
    async getMerchantDashboard(merchantId) {
        return this.eventsService.getMerchantEventsDashboard(merchantId);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create an event' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events by merchant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events returned.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findByMerchant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('public/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'List upcoming public events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "listPublicEvents", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/tickets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my purchased tickets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tickets returned.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getMyTickets", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('purchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Purchase a ticket for an event' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ticket purchased.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, event_dto_1.PurchaseTicketDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "purchaseTicket", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('validate/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate a ticket by QR code (staff)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket validated.' }),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "validateTicket", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER, client_1.UserRole.MERCHANT_STAFF),
    (0, common_1.Get)(':id/tickets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tickets for an event (staff only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tickets returned.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paginated_dto_1.PaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventTickets", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('dashboard/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event dashboard stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data.' }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventDashboard", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('merchant/:merchantId/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get merchant events dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data.' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getMerchantDashboard", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('Events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map