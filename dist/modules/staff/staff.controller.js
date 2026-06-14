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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const subscription_guard_1 = require("../billing/subscription.guard");
const staff_service_1 = require("./staff.service");
class AddStaffDto {
    merchantId;
    email;
    role;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddStaffDto.prototype, "merchantId", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AddStaffDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], AddStaffDto.prototype, "role", void 0);
class UpdateStaffRoleDto {
    role;
}
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], UpdateStaffRoleDto.prototype, "role", void 0);
let StaffController = class StaffController {
    staffService;
    constructor(staffService) {
        this.staffService = staffService;
    }
    async addStaff(dto) {
        return this.staffService.addStaffByEmail(dto.merchantId, dto.email, dto.role);
    }
    async listStaff(merchantId) {
        return this.staffService.listStaff(merchantId);
    }
    async removeStaff(merchantId, userId) {
        return this.staffService.removeStaff(merchantId, userId);
    }
    async updateRole(merchantId, userId, dto) {
        return this.staffService.updateStaffRole(merchantId, userId, dto.role);
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add staff to merchant' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddStaffDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "addStaff", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Get)('merchant/:merchantId'),
    (0, swagger_1.ApiOperation)({ summary: 'List staff by merchant' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "listStaff", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)(':merchantId/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove staff from merchant' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "removeStaff", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)(':merchantId/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff role' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateStaffRoleDto]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateRole", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('staff'),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map