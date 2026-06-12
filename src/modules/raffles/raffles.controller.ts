import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto, UpdateRaffleDto } from './dto/raffle.dto';

@ApiTags('Raffles')
@ApiBearerAuth()
@Controller('raffles')
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a raffle' })
  async create(@Body() dto: CreateRaffleDto) {
    return this.rafflesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get raffles by merchant' })
  async findByMerchant(@Param('merchantId') merchantId: string) {
    return this.rafflesService.findByMerchant(merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get active raffles for customer' })
  async getCustomerRaffles(@Param('customerId') customerId: string) {
    return this.rafflesService.getActiveRafflesForCustomer(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get raffle by ID' })
  async findById(@Param('id') id: string) {
    return this.rafflesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a raffle' })
  async update(@Param('id') id: string, @Body() dto: UpdateRaffleDto) {
    return this.rafflesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a raffle' })
  async delete(@Param('id') id: string) {
    return this.rafflesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enter/:customerId')
  @ApiOperation({ summary: 'Enter a raffle' })
  async enter(@Param('id') id: string, @Param('customerId') customerId: string) {
    return this.rafflesService.enterRaffle(id, customerId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post(':id/draw')
  @ApiOperation({ summary: 'Draw winners' })
  async draw(@Param('id') id: string) {
    return this.rafflesService.drawWinners(id);
  }
}
