import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, PurchaseTicketDto } from './dto/event.dto';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ─── CRUD (solo merchant owner / admin) ────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({ status: 201, description: 'Event created.' })
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get events by merchant' })
  @ApiResponse({ status: 200, description: 'Events returned.' })
  async findByMerchant(@Param('merchantId') merchantId: string, @Query() pagination: PaginatedQueryDto) {
    return this.eventsService.findByMerchant(merchantId, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event found.' })
  async findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event updated.' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event deleted.' })
  async delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }

  // ─── Endpoints públicos (clientes) ─────────────────────────────

  @Get('public/upcoming')
  @ApiOperation({ summary: 'List upcoming public events' })
  @ApiResponse({ status: 200, description: 'Events returned.' })
  async listPublicEvents(@Query() pagination: PaginatedQueryDto) {
    return this.eventsService.listPublicEvents(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/tickets')
  @ApiOperation({ summary: 'Get my purchased tickets' })
  @ApiResponse({ status: 200, description: 'Tickets returned.' })
  async getMyTickets(@Request() req) {
    const customerProfile = await this.eventsService.findCustomerProfile(req.user.id);
    if (!customerProfile) return { tickets: [] };
    return this.eventsService.getMyTickets(customerProfile.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  @ApiOperation({ summary: 'Purchase a ticket for an event' })
  @ApiResponse({ status: 201, description: 'Ticket purchased.' })
  async purchaseTicket(@Request() req, @Body() dto: PurchaseTicketDto) {
    const customerProfile = await this.eventsService.findCustomerProfile(req.user.id);
    if (!customerProfile) {
      return { message: 'Customer profile not found' };
    }
    return this.eventsService.purchaseTicket(customerProfile.id, dto);
  }

  // ─── Validación de tickets (staff) ─────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('validate/:code')
  @ApiOperation({ summary: 'Validate a ticket by QR code (staff)' })
  @ApiResponse({ status: 200, description: 'Ticket validated.' })
  async validateTicket(@Param('code') code: string, @Request() req) {
    return this.eventsService.validateTicket(code, req.user.id);
  }

  // ─── Tickets listing (staff) ──────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get(':id/tickets')
  @ApiOperation({ summary: 'Get tickets for an event (staff only)' })
  @ApiResponse({ status: 200, description: 'Tickets returned.' })
  async getEventTickets(@Param('id') eventId: string, @Query() pagination: PaginatedQueryDto) {
    return this.eventsService.getEventTickets(eventId, pagination);
  }

  // ─── Dashboard ─────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/:eventId')
  @ApiOperation({ summary: 'Get event dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard data.' })
  async getEventDashboard(@Param('eventId') eventId: string) {
    return this.eventsService.getEventDashboard(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId/dashboard')
  @ApiOperation({ summary: 'Get merchant events dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard data.' })
  async getMerchantDashboard(@Param('merchantId') merchantId: string) {
    return this.eventsService.getMerchantEventsDashboard(merchantId);
  }
}
