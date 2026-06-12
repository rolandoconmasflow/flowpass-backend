import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { QrService } from './qr.service';
import { VisitsService } from '../visits/visits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@ApiTags('QR')
@ApiBearerAuth()
@Controller('qr')
export class QrController {
  constructor(
    private readonly qrService: QrService,
    private readonly visitsService: VisitsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':code')
  @ApiOperation({ summary: 'Get QR code information' })
  @ApiResponse({ status: 200, description: 'QR info returned.' })
  async getQRInfo(@Param('code') code: string) {
    return this.qrService.getQRInfo(code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post(':code/check-in')
  @ApiOperation({ summary: 'Check in using QR code (CUSTOMER only)' })
  @ApiResponse({ status: 201, description: 'Check-in recorded.' })
  async checkIn(@Param('code') code: string, @Request() req: RequestWithUser) {
    return this.visitsService.checkIn(req.user.id, code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post(':id/regenerate')
  @ApiOperation({ summary: 'Regenerate QR code (staff only)' })
  @ApiResponse({ status: 201, description: 'QR regenerated.' })
  async regenerateQr(@Param('id') id: string) {
    return this.qrService.regenerateQR(id);
  }
}
