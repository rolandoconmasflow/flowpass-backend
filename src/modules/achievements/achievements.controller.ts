import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/achievement.dto';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create an achievement' })
  @ApiResponse({ status: 201, description: 'Achievement created.' })
  async create(@Body() dto: CreateAchievementDto) {
    return this.achievementsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get achievements by merchant' })
  async findByMerchant(@Param('merchantId') merchantId: string) {
    return this.achievementsService.findByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get achievement by ID' })
  async findById(@Param('id') id: string) {
    return this.achievementsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an achievement' })
  async update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
    return this.achievementsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an achievement' })
  async delete(@Param('id') id: string) {
    return this.achievementsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/award/:customerId')
  @ApiOperation({ summary: 'Manually award an achievement' })
  async award(@Param('id') id: string, @Param('customerId') customerId: string) {
    return this.achievementsService.awardAchievement(customerId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get customer achievements' })
  async getCustomerAchievements(@Param('customerId') customerId: string) {
    return this.achievementsService.getCustomerAchievements(customerId);
  }
}
