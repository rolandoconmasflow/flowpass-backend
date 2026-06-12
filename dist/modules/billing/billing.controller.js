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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const billing_service_1 = require("./billing.service");
const billing_dto_1 = require("./dto/billing.dto");
let BillingController = class BillingController {
    billingService;
    constructor(billingService) {
        this.billingService = billingService;
    }
    async getPlans() {
        return this.billingService.getPlans();
    }
    async getMySubscription(req) {
        return this.billingService.getMySubscription(req.user.id);
    }
    async createCheckout(req, dto) {
        return this.billingService.createCheckoutSession(req.user.id, dto.planId);
    }
    async webhook(req, signature) {
        const rawBody = req.rawBody;
        if (!rawBody)
            throw new common_1.BadRequestException('Raw body no disponible');
        return this.billingService.handleWebhook(signature, rawBody);
    }
    async cancel(req) {
        return this.billingService.cancelSubscription(req.user.id);
    }
    async getInvoices(req) {
        return this.billingService.getInvoices(req.user.id);
    }
    async getPortal(req) {
        return this.billingService.getPortalUrl(req.user.id);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista los planes de suscripción activos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Planes devueltos.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPlans", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MERCHANT_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('my-subscription'),
    (0, swagger_1.ApiOperation)({ summary: 'Suscripción actual del comercio' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getMySubscription", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MERCHANT_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una sesión de Stripe Checkout' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, billing_dto_1.CreateCheckoutDto]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook de Stripe (firma requerida)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "webhook", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MERCHANT_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancela la suscripción al fin del período' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "cancel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MERCHANT_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de pagos del comercio' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MERCHANT_OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('portal'),
    (0, swagger_1.ApiOperation)({ summary: 'URL del Customer Portal de Stripe' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getPortal", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map