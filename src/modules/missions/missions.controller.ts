import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { MissionsService } from './missions.service';
import { CreateMissionDto, UpdateMissionDto } from './dto/mission.dto';

@ApiTags('Missions')
@ApiBearerAuth()
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a mission' })
  async create(@Body() dto: CreateMissionDto) {
    return this.missionsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get missions by merchant' })
  async findByMerchant(@Param('merchantId') merchantId: string) {
    return this.missionsService.findByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get active missions for customer' })
  async getCustomerMissions(@Param('customerId') customerId: string) {
    return this.missionsService.getActiveMissionsForCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get mission by ID' })
  async findById(@Param('id') id: string) {
    return this.missionsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a mission' })
  async update(@Param('id') id: string, @Body() dto: UpdateMissionDto) {
    return this.missionsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mission' })
  async delete(@Param('id') id: string) {
    return this.missionsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/progress/:customerId')
  @ApiOperation({ summary: 'Track mission progress' })
  async trackProgress(@Param('id') id: string, @Param('customerId') customerId: string) {
    return this.missionsService.trackProgress(customerId, id);
  }
}
