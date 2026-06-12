import { Controller, Get, Post, Body, Req, UseGuards, Headers, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BillingService } from './billing.service';
import { CreateCheckoutDto } from './dto/billing.dto';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Lista los planes de suscripción activos' })
  @ApiResponse({ status: 200, description: 'Planes devueltos.' })
  async getPlans() {
    return this.billingService.getPlans();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT_OWNER)
  @ApiBearerAuth()
  @Get('my-subscription')
  @ApiOperation({ summary: 'Suscripción actual del comercio' })
  async getMySubscription(@Req() req: any) {
    return this.billingService.getMySubscription(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT_OWNER)
  @ApiBearerAuth()
  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de Stripe Checkout' })
  async createCheckout(@Req() req: any, @Body() dto: CreateCheckoutDto) {
    return this.billingService.createCheckoutSession(req.user.id, dto.planId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook de Stripe (firma requerida)' })
  async webhook(@Req() req: Request, @Headers('stripe-signature') signature: string) {
    const rawBody = (req as any).rawBody as Buffer;
    if (!rawBody) throw new BadRequestException('Raw body no disponible');
    return this.billingService.handleWebhook(signature, rawBody);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT_OWNER)
  @ApiBearerAuth()
  @Post('cancel')
  @ApiOperation({ summary: 'Cancela la suscripción al fin del período' })
  async cancel(@Req() req: any) {
    return this.billingService.cancelSubscription(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT_OWNER)
  @ApiBearerAuth()
  @Get('invoices')
  @ApiOperation({ summary: 'Historial de pagos del comercio' })
  async getInvoices(@Req() req: any) {
    return this.billingService.getInvoices(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT_OWNER)
  @ApiBearerAuth()
  @Get('portal')
  @ApiOperation({ summary: 'URL del Customer Portal de Stripe' })
  async getPortal(@Req() req: any) {
    return this.billingService.getPortalUrl(req.user.id);
  }
}
