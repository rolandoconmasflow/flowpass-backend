import { Controller, Get, Post, Body, Param, UseGuards, Query, Request, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckInDto } from '../../dtos/checkin.dto';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  @ApiOperation({ summary: 'Check in with QR code' })
  @ApiResponse({ status: 201, description: 'Check-in recorded.' })
  async checkIn(@Body() checkInDto: CheckInDto, @Request() req) {
    return this.visitsService.checkIn(req.user.id, checkInDto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer')
  @ApiOperation({ summary: 'Get visits by customer ID' })
  @ApiResponse({ status: 200, description: 'Visits returned.' })
  async getCustomerVisits(@Query('customerId') customerId: string, @Request() req, @Query() pagination: PaginatedQueryDto) {
    const isStaffOrAbove = req.user.role === 'SUPER_ADMIN' || req.user.role === 'MERCHANT_OWNER' || req.user.role === 'MERCHANT_STAFF';
    if (!isStaffOrAbove) {
      const ownProfile = await this.visitsService.findCustomerProfileByUserId(req.user.id);
      if (!ownProfile || ownProfile.id !== customerId) {
        throw new ForbiddenException('You do not have permission to view these visits');
      }
    }
    return this.visitsService.getVisitsByCustomer(customerId, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get visits by merchant' })
  @ApiResponse({ status: 200, description: 'Visits returned.' })
  async getVisitsByMerchant(@Param('merchantId') merchantId: string, @Query() pagination: PaginatedQueryDto) {
    return this.visitsService.getVisitsByMerchant(merchantId, pagination);
  }
}
