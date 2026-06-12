import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get merchant dashboard data' })
  async getMerchantDashboard(@Param('merchantId') merchantId: string) {
    return this.dashboardService.getMerchantDashboard(merchantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('admin')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }
}
