import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { LevelsService } from './levels.service';
import { CreateLevelDto, UpdateLevelDto } from '../../dtos/level.dto';

@ApiTags('Levels')
@ApiBearerAuth()
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a loyalty level' })
  @ApiResponse({ status: 201, description: 'Level created.' })
  async create(@Body() dto: CreateLevelDto) {
    return this.levelsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get levels by merchant' })
  @ApiResponse({ status: 200, description: 'Levels returned.' })
  async findByMerchant(@Param('merchantId') merchantId: string) {
    return this.levelsService.findByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get level by ID' })
  @ApiResponse({ status: 200, description: 'Level found.' })
  async findById(@Param('id') id: string) {
    return this.levelsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a level' })
  @ApiResponse({ status: 200, description: 'Level updated.' })
  async update(@Param('id') id: string, @Body() dto: UpdateLevelDto) {
    return this.levelsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a level' })
  @ApiResponse({ status: 200, description: 'Level deleted.' })
  async delete(@Param('id') id: string) {
    return this.levelsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('membership/:membershipId')
  @ApiOperation({ summary: 'Get level for a membership' })
  @ApiResponse({ status: 200, description: 'Level returned.' })
  async getMembershipLevel(@Param('membershipId') membershipId: string) {
    return this.levelsService.getMembershipLevel(membershipId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('merchant/:merchantId/enable')
  @ApiOperation({ summary: 'Enable loyalty levels for a merchant' })
  @ApiResponse({ status: 200, description: 'Levels enabled.' })
  async enableLevels(@Param('merchantId') merchantId: string) {
    return this.levelsService.enableLevelsForMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('merchant/:merchantId/disable')
  @ApiOperation({ summary: 'Disable loyalty levels for a merchant' })
  @ApiResponse({ status: 200, description: 'Levels disabled.' })
  async disableLevels(@Param('merchantId') merchantId: string) {
    return this.levelsService.disableLevelsForMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId/status')
  @ApiOperation({ summary: 'Get levels enabled status for a merchant' })
  @ApiResponse({ status: 200, description: 'Status returned.' })
  async getLevelsStatus(@Param('merchantId') merchantId: string) {
    return this.levelsService.getMerchantLevelsStatus(merchantId);
  }
}
