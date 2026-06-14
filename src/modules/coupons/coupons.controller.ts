import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { UserRole } from '@prisma/client';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get own coupons' })
  @ApiResponse({ status: 200, description: 'Coupons returned.' })
  async getMyCoupons(@Request() req: RequestWithUser, @Query() query: PaginatedQueryDto) {
    return await this.couponsService.getCouponsByUserId(req.user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get coupons by customer ID (own or staff)' })
  @ApiResponse({ status: 200, description: 'Coupons returned.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getCustomerCoupons(
    @Param('customerId') customerId: string,
    @Request() req: RequestWithUser,
    @Query() query: PaginatedQueryDto,
  ) {
    const isStaffOrAbove =
      req.user.role === 'SUPER_ADMIN' ||
      req.user.role === 'MERCHANT_OWNER' ||
      req.user.role === 'MERCHANT_STAFF';
    if (!isStaffOrAbove) {
      const ownProfile = await this.couponsService.findCustomerProfileByUserId(req.user.id);
      if (!ownProfile || ownProfile.id !== customerId) {
        throw new ForbiddenException('No tienes permiso para ver estos cupones');
      }
    }
    return await this.couponsService.getCouponsByCustomer(customerId, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all coupons (admin)' })
  @ApiResponse({ status: 200, description: 'Coupons returned.' })
  async getAllCoupons(@Query() query: PaginatedQueryDto) {
    return await this.couponsService.getAllCoupons(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get coupons by merchant' })
  @ApiResponse({ status: 200, description: 'Coupons returned.' })
  async getCouponsByMerchant(@Param('merchantId') merchantId: string, @Query() query: PaginatedQueryDto) {
    return await this.couponsService.getCouponsByMerchant(merchantId, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a coupon' })
  @ApiResponse({ status: 200, description: 'Coupon cancelled.' })
  async cancelCoupon(@Param('id') id: string) {
    return await this.couponsService.cancelCoupon(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get(':code')
  @ApiOperation({ summary: 'Get coupon by code (staff only)' })
  @ApiResponse({ status: 200, description: 'Coupon found.' })
  @ApiResponse({ status: 404, description: 'Coupon not found.' })
  async getCoupon(@Param('code') code: string) {
    return await this.couponsService.getCouponByCode(code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Post(':code/redeem')
  @ApiOperation({ summary: 'Redeem a coupon (staff only)' })
  @ApiResponse({ status: 201, description: 'Coupon redeemed.' })
  async redeemCoupon(@Param('code') code: string) {
    return await this.couponsService.redeemCoupon(code);
  }
}
