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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const locations_service_1 = require("./locations.service");
const qr_service_1 = require("../qr/qr.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const subscription_guard_1 = require("../billing/subscription.guard");
const location_dto_1 = require("../../dtos/location.dto");
let LocationsController = class LocationsController {
    locationsService;
    qrService;
    constructor(locationsService, qrService) {
        this.locationsService = locationsService;
        this.qrService = qrService;
    }
    async findAll() {
        return await this.locationsService.findAll();
    }
    async findNearby(lat, lng, radius) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = radius ? parseFloat(radius) : 10;
        return await this.locationsService.findNearby(latitude, longitude, radiusKm);
    }
    async findOne(id) {
        return await this.locationsService.findOne(id);
    }
    async create(createLocationDto) {
        return await this.locationsService.create(createLocationDto);
    }
    async generateQr(id) {
        return await this.qrService.generateQRForLocation(id);
    }
    async update(id, updateLocationDto) {
        return await this.locationsService.update(id, updateLocationDto);
    }
    async remove(id) {
        return await this.locationsService.remove(id);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all locations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Locations returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Find nearby locations by GPS coordinates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nearby locations returned.' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findNearby", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get location by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a location' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Location created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.CreateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Post)(':id/generate-qr'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QR code for a location' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'QR generated.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "generateQr", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MERCHANT_OWNER),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "remove", null);
exports.LocationsController = LocationsController = __decorate([
    (0, swagger_1.ApiTags)('Locations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService,
        qr_service_1.QrService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map