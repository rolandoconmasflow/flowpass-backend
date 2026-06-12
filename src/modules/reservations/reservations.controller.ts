import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { ReservationsService } from './reservations.service';
import {
  CreateTableDto,
  UpdateTableDto,
  CreateReservationDto,
  UpdateReservationStatusDto,
  AvailableSlotsQueryDto,
} from './dto/reservations.dto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // ─── Tables (Merchant/Admin only) ─────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Get('tables/:merchantId')
  @ApiOperation({ summary: 'Get all tables for a merchant' })
  @ApiResponse({ status: 200, description: 'Tables returned.' })
  async getTables(@Param('merchantId') merchantId: string) {
    return this.reservationsService.getTables(merchantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('tables')
  @ApiOperation({ summary: 'Create a table' })
  @ApiResponse({ status: 201, description: 'Table created.' })
  async createTable(@Body() dto: CreateTableDto) {
    return this.reservationsService.createTable(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch('tables/:id')
  @ApiOperation({ summary: 'Update a table' })
  @ApiResponse({ status: 200, description: 'Table updated.' })
  async updateTable(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.reservationsService.updateTable(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete('tables/:id')
  @ApiOperation({ summary: 'Delete a table' })
  @ApiResponse({ status: 200, description: 'Table deleted.' })
  async deleteTable(@Param('id') id: string) {
    return this.reservationsService.deleteTable(id);
  }

  // ─── Public: available slots ──────────────────────────────────

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots for a merchant on a date (public)' })
  @ApiResponse({ status: 200, description: 'Available slots returned.' })
  async getAvailableSlots(@Query() query: AvailableSlotsQueryDto) {
    return this.reservationsService.getAvailableSlots(query.merchantId, query.date);
  }

  // ─── Reservations (Merchant) ──────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get reservations for a merchant (optionally filter by date)' })
  @ApiResponse({ status: 200, description: 'Reservations returned.' })
  async getMerchantReservations(@Param('merchantId') merchantId: string, @Query('date') date?: string) {
    return this.reservationsService.getMerchantReservations(merchantId, date);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update reservation status (confirm, cancel, complete)' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateReservationStatusDto) {
    return this.reservationsService.updateStatus(id, dto);
  }

  // ─── Reservations (Customer) ──────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Get my reservations' })
  @ApiResponse({ status: 200, description: 'My reservations returned.' })
  async getMyReservations(@Req() req: RequestWithUser) {
    return this.reservationsService.getMyReservations(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created.' })
  async createReservation(@Req() req: RequestWithUser, @Body() dto: CreateReservationDto) {
    return this.reservationsService.createReservation(dto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel my reservation' })
  @ApiResponse({ status: 200, description: 'Reservation cancelled.' })
  async cancelMyReservation(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.reservationsService.cancelMyReservation(id, req.user.id);
  }
}
