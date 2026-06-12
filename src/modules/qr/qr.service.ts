import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  constructor(private prisma: PrismaService) {}

  async generateQRForLocation(
    locationId: string,
  ): Promise<{
    code: string;
    publicUrl: string;
    qrImageDataUrl: string | null;
    locationId: string;
    merchantId: string;
  }> {
    const location = await this.prisma.merchantLocation.findUnique({
      where: { id: locationId },
      include: { merchant: true },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
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

    let qrImageDataUrl: string | null = null;
    try {
      qrImageDataUrl = await QRCode.toDataURL(code);
    } catch {
      // QR image generation is optional
    }

    return { code, publicUrl, qrImageDataUrl, locationId, merchantId: location.merchantId };
  }

  async getQRInfo(code: string) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { code },
      include: { location: true, merchant: true },
    });

    if (!qrCode) {
      throw new NotFoundException('QR Code not found');
    }

    if (!qrCode.location || !qrCode.merchant) {
      throw new NotFoundException('QR Code location or merchant not found');
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

  async generateQrCodeDataUrl(text: string): Promise<string> {
    const qrCodeBuffer = await QRCode.toBuffer(text);
    return `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
  }

  async regenerateQR(id: string) {
    return {
      id,
      code: `FLOWPASS-QR-${id}`,
      regenerated: true,
      message: 'QR regenerated in demo mode',
    };
  }
}
