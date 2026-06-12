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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let LocationsService = class LocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return await this.prisma.merchantLocation.findMany();
    }
    async findOne(id) {
        return await this.prisma.merchantLocation.findUnique({
            where: { id },
        });
    }
    async findNearby(lat, lng, radiusKm = 10) {
        const locations = await this.prisma.merchantLocation.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null },
            },
            include: { merchant: true },
        });
        return locations
            .filter((loc) => {
            if (loc.latitude === null || loc.longitude === null)
                return false;
            const distance = this.haversine(lat, lng, loc.latitude, loc.longitude);
            return distance <= radiusKm;
        })
            .map((loc) => ({
            ...loc,
            distance: this.haversine(lat, lng, loc.latitude, loc.longitude),
        }))
            .sort((a, b) => a.distance - b.distance);
    }
    haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
    async create(data) {
        return await this.prisma.merchantLocation.create({
            data: data,
        });
    }
    async update(id, data) {
        return await this.prisma.merchantLocation.update({
            where: { id },
            data: data,
        });
    }
    async remove(id) {
        return await this.prisma.merchantLocation.delete({
            where: { id },
        });
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map