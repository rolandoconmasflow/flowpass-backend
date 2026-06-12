import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PosService } from './pos.service';

class PosCheckInDto {
  merchantId!: string;
  locationId!: string;
  customerPhone!: string;
}

class PosRedeemCouponDto {
  merchantId!: string;
  code!: string;
}

@ApiTags('POS')
@ApiBearerAuth()
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Post('checkin')
  @ApiOperation({ summary: 'POS check-in by phone' })
  async checkIn(@Body() dto: PosCheckInDto) {
    return this.posService.checkInCustomer(dto.merchantId, dto.locationId, dto.customerPhone);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Post('redeem-coupon')
  @ApiOperation({ summary: 'Redeem a coupon by code' })
  async redeemCoupon(@Body() dto: PosRedeemCouponDto) {
    return this.posService.redeemCoupon(dto.merchantId, dto.code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Post('redeem-reward/:merchantId/:customerId/:rewardId')
  @ApiOperation({ summary: 'Redeem a reward at POS' })
  async redeemReward(
    @Param('merchantId') merchantId: string,
    @Param('customerId') customerId: string,
    @Param('rewardId') rewardId: string,
  ) {
    return this.posService.redeemReward(merchantId, customerId, rewardId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('lookup/:merchantId')
  @ApiOperation({ summary: 'Lookup customer by phone/email/name' })
  async lookupCustomer(
    @Param('merchantId') merchantId: string,
    @Query('q') query: string,
  ) {
    return this.posService.lookupCustomer(merchantId, query);
  }
}
