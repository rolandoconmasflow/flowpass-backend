import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EcommerceService } from './ecommerce.service';

@ApiTags('Ecommerce')
@Controller('ecommerce')
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  @Get('merchant/:slug')
  @ApiOperation({ summary: 'Get public merchant data by slug' })
  async getMerchant(@Param('slug') slug: string) {
    return this.ecommerceService.getPublicMerchant(slug);
  }

  @Get('rewards/:slug')
  @ApiOperation({ summary: 'Get public rewards by merchant slug' })
  async getRewards(@Param('slug') slug: string) {
    return this.ecommerceService.getPublicRewards(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post('claim/:slug/:promotionId/:customerId')
  @ApiOperation({ summary: 'Claim a promotion' })
  async claimPromotion(
    @Param('slug') slug: string,
    @Param('promotionId') promotionId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.ecommerceService.claimPromotion(slug, promotionId, customerId);
  }
}
