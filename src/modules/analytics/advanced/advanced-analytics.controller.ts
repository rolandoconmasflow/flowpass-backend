import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdvancedAnalyticsService } from './advanced-analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseInterceptors(CacheInterceptor)
export class AdvancedAnalyticsController {
  constructor(private readonly analyticsService: AdvancedAnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('retention/:merchantId')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Get retention rate' })
  async retention(@Param('merchantId') merchantId: string) {
    return this.analyticsService.getRetentionRate(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('cohorts/:merchantId')
  @CacheTTL(600)
  @ApiOperation({ summary: 'Get cohort analysis' })
  async cohorts(@Param('merchantId') merchantId: string) {
    return this.analyticsService.getCohortAnalysis(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('economics/:merchantId')
  @CacheTTL(300)
  @ApiOperation({ summary: 'Get points economics' })
  async economics(@Param('merchantId') merchantId: string) {
    return this.analyticsService.getPointsEconomics(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/:merchantId')
  @CacheTTL(120)
  @ApiOperation({ summary: 'Get full analytics dashboard' })
  async dashboard(@Param('merchantId') merchantId: string) {
    return this.analyticsService.getDashboard(merchantId);
  }
}
