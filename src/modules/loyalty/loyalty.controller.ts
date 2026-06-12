import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LoyaltyService } from './loyalty.service';
import { CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, CreateRewardDto, UpdateRewardDto } from '../../dtos/loyalty.dto';

@ApiTags('Loyalty')
@ApiBearerAuth()
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('programs')
  @ApiOperation({ summary: 'Create a loyalty program' })
  @ApiResponse({ status: 201, description: 'Loyalty program created.' })
  async createProgram(@Body() dto: CreateLoyaltyProgramDto) {
    return this.loyaltyService.createProgram(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('programs')
  @ApiOperation({ summary: 'List all loyalty programs' })
  @ApiResponse({ status: 200, description: 'Loyalty programs returned.' })
  async getAllPrograms() {
    return this.loyaltyService.getAllPrograms();
  }

  @UseGuards(JwtAuthGuard)
  @Get('programs/merchant/:merchantId')
  @ApiOperation({ summary: 'Get programs by merchant' })
  @ApiResponse({ status: 200, description: 'Programs returned.' })
  async getProgramsByMerchant(@Param('merchantId') merchantId: string) {
    return this.loyaltyService.getProgramsByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('programs/:id')
  @ApiOperation({ summary: 'Get loyalty program by ID' })
  @ApiResponse({ status: 200, description: 'Program found.' })
  async getProgramById(@Param('id') id: string) {
    return this.loyaltyService.getProgramById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch('programs/:id')
  @ApiOperation({ summary: 'Update a loyalty program' })
  @ApiResponse({ status: 200, description: 'Program updated.' })
  async updateProgram(@Param('id') id: string, @Body() dto: UpdateLoyaltyProgramDto) {
    return this.loyaltyService.updateProgram(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete('programs/:id')
  @ApiOperation({ summary: 'Delete a loyalty program' })
  @ApiResponse({ status: 200, description: 'Program deleted.' })
  async deleteProgram(@Param('id') id: string) {
    return this.loyaltyService.deleteProgram(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('rewards')
  @ApiOperation({ summary: 'Create a reward' })
  @ApiResponse({ status: 201, description: 'Reward created.' })
  async createReward(@Body() dto: CreateRewardDto) {
    return this.loyaltyService.createReward(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rewards')
  @ApiOperation({ summary: 'List all rewards' })
  @ApiResponse({ status: 200, description: 'Rewards returned.' })
  async getAllRewards() {
    return this.loyaltyService.getAllRewards();
  }

  @UseGuards(JwtAuthGuard)
  @Get('rewards/merchant/:merchantId')
  @ApiOperation({ summary: 'Get rewards by merchant' })
  @ApiResponse({ status: 200, description: 'Rewards returned.' })
  async getRewardsByMerchant(@Param('merchantId') merchantId: string) {
    return this.loyaltyService.getRewardsByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rewards/:id')
  @ApiOperation({ summary: 'Get reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward found.' })
  async getRewardById(@Param('id') id: string) {
    return this.loyaltyService.getRewardById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch('rewards/:id')
  @ApiOperation({ summary: 'Update a reward' })
  @ApiResponse({ status: 200, description: 'Reward updated.' })
  async updateReward(@Param('id') id: string, @Body() dto: UpdateRewardDto) {
    return this.loyaltyService.updateReward(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete('rewards/:id')
  @ApiOperation({ summary: 'Delete a reward' })
  @ApiResponse({ status: 200, description: 'Reward deleted.' })
  async deleteReward(@Param('id') id: string) {
    return this.loyaltyService.deleteReward(id);
  }
}
