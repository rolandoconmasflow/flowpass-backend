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
exports.QrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const QRCode = require("qrcode");
let QrService = class QrService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateQRForLocation(locationId) {
        const location = await this.prisma.merchantLocation.findUnique({
            where: { id: locationId },
            include: { merchant: true },
        });
        if (!location) {
            throw new common_1.NotFoundException('Location not found');
        }
        const code = `fp_loc_ck_${Math.random().toString(36).substring(2, 15)}`;
        const publicUrl = `http://localhost:3000/qr/${code}`;
        await this.prisma.qRCode.create({
            data: {
                code,
                merchantId: location.merchantId,
                locationId,
                type: 'LOCATION_CHECKIN',
                isActive: true,
            },
        });
        let qrImageDataUrl = null;
        try {
            qrImageDataUrl = await QRCode.toDataURL(code);
        }
        catch {
        }
        return { code, publicUrl, qrImageDataUrl, locationId, merchantId: location.merchantId };
    }
    async getQRInfo(code) {
        const qrCode = await this.prisma.qRCode.findUnique({
            where: { code },
            include: { location: true, merchant: true },
        });
        if (!qrCode) {
            throw new common_1.NotFoundException('QR Code not found');
        }
        if (!qrCode.location || !qrCode.merchant) {
            throw new common_1.NotFoundException('QR Code location or merchant not found');
        }
        return {
            merchant: {
                id: qrCode.merchantId,
                name: qrCode.merchant.name,
                slug: qrCode.merchant.slug,
                logoUrl: qrCode.merchant.logoUrl,
            },
            location: {
                id: qrCode.locationId,
                name: qrCode.location.name,
                address: qrCode.location.address,
                city: qrCode.location.city,
            },
            qr: { active: qrCode.isActive },
        };
    }
    async generateQrCodeDataUrl(text) {
        const qrCodeBuffer = await QRCode.toBuffer(text);
        return `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
    }
    async regenerateQR(id) {
        return {
            id,
            code: `FLOWPASS-QR-${id}`,
            regenerated: true,
            message: 'QR regenerated in demo mode',
        };
    }
};
exports.QrService = QrService;
exports.QrService = QrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrService);
//# sourceMappingURL=qr.service.js.map