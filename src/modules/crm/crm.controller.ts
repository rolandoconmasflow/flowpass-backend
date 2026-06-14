import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CrmService } from './crm.service';

@ApiTags('CRM')
@ApiBearerAuth()
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('customers/:merchantId')
  @ApiOperation({ summary: 'Get customers with filters' })
  async getCustomers(
    @Param('merchantId') merchantId: string,
    @Query('minPoints') minPoints?: string,
    @Query('maxPoints') maxPoints?: string,
    @Query('minVisits') minVisits?: string,
    @Query('level') level?: string,
    @Query('status') status?: string,
    @Query('joinedAfter') joinedAfter?: string,
    @Query('joinedBefore') joinedBefore?: string,
  ) {
    return this.crmService.getCustomers(merchantId, {
      minPoints: minPoints ? parseInt(minPoints) : undefined,
      maxPoints: maxPoints ? parseInt(maxPoints) : undefined,
      minVisits: minVisits ? parseInt(minVisits) : undefined,
      level,
      status,
      joinedAfter,
      joinedBefore,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('segments/:merchantId')
  @ApiOperation({ summary: 'Get customer segments' })
  async getSegments(@Param('merchantId') merchantId: string) {
    return this.crmService.getSegments(merchantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER, UserRole.MERCHANT_STAFF)
  @Get('timeline/:customerId/:merchantId')
  @ApiOperation({ summary: 'Get customer timeline' })
  async getTimeline(@Param('customerId') customerId: string, @Param('merchantId') merchantId: string) {
    return this.crmService.getCustomerTimeline(customerId, merchantId);
  }
}
