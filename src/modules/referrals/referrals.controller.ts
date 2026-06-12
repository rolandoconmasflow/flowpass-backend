import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReferralsService } from './referrals.service';

class ProcessReferralDto {
  code!: string;
  referredId!: string;
  merchantId!: string;
}

@ApiTags('Referrals')
@ApiBearerAuth()
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('code/:customerId')
  @ApiOperation({ summary: 'Generate or get referral code' })
  @ApiResponse({ status: 200, description: 'Referral code returned.' })
  async generateCode(@Param('customerId') customerId: string) {
    return this.referralsService.generateCode(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('code/:customerId')
  @ApiOperation({ summary: 'Get referral code' })
  async getCode(@Param('customerId') customerId: string) {
    return this.referralsService.getCode(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('process')
  @ApiOperation({ summary: 'Process a referral' })
  @ApiResponse({ status: 201, description: 'Referral processed.' })
  async processReferral(@Body() dto: ProcessReferralDto) {
    return this.referralsService.processReferral(dto.code, dto.referredId, dto.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats/:customerId/:merchantId')
  @ApiOperation({ summary: 'Get referral stats' })
  async getStats(
    @Param('customerId') customerId: string,
    @Param('merchantId') merchantId: string,
  ) {
    return this.referralsService.getReferralStats(customerId, merchantId);
  }
}
