import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { RewardsService } from './rewards.service';
import { CreateRewardDto, UpdateRewardDto } from './dto/reward.dto';

@ApiTags('Rewards')
@ApiBearerAuth()
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a reward' })
  async create(@Body() dto: CreateRewardDto) {
    return this.rewardsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get rewards by merchant' })
  async findByMerchant(@Param('merchantId') merchantId: string) {
    return this.rewardsService.findByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('catalog/:customerId')
  @ApiOperation({ summary: 'Get rewards catalog for customer' })
  async catalog(@Param('customerId') customerId: string) {
    return this.rewardsService.getCustomerCatalog(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get reward by ID' })
  async findById(@Param('id') id: string) {
    return this.rewardsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a reward' })
  async update(@Param('id') id: string, @Body() dto: UpdateRewardDto) {
    return this.rewardsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward' })
  async delete(@Param('id') id: string) {
    return this.rewardsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/redeem/:customerId')
  @ApiOperation({ summary: 'Redeem a reward' })
  async redeem(@Param('id') id: string, @Param('customerId') customerId: string) {
    return this.rewardsService.redeem(id, customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:membershipId')
  @ApiOperation({ summary: 'Get redemption history' })
  async history(@Param('membershipId') membershipId: string) {
    return this.rewardsService.getRedemptionHistory(membershipId);
  }
}
