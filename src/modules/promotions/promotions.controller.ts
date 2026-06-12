import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto } from '../../dtos/promotion.dto';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a promotion (staff only)' })
  @ApiResponse({ status: 201, description: 'Promotion created.' })
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionsService.createPromotion(createPromotionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all promotions' })
  @ApiResponse({ status: 200, description: 'Promotions returned.' })
  async getAllPromotions(@Query() query: PaginatedQueryDto) {
    return await this.promotionsService.getAllPromotions(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  @ApiOperation({ summary: 'Get promotions near a GPS location' })
  @ApiResponse({ status: 200, description: 'Nearby promotions returned.' })
  async getNearbyPromotions(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = radius ? parseFloat(radius) : 10;
    return await this.promotionsService.getNearbyPromotions(latitude, longitude, radiusKm);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get promotions by merchant' })
  @ApiResponse({ status: 200, description: 'Promotions returned.' })
  async getPromotionsByMerchant(@Param('merchantId') merchantId: string, @Query() query: PaginatedQueryDto) {
    return await this.promotionsService.getPromotionsByMerchant(merchantId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiResponse({ status: 200, description: 'Promotion found.' })
  async getPromotionById(@Param('id') id: string) {
    return await this.promotionsService.getPromotionById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a promotion' })
  @ApiResponse({ status: 200, description: 'Promotion updated.' })
  async updatePromotion(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return await this.promotionsService.updatePromotion(id, updatePromotionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiResponse({ status: 200, description: 'Promotion deleted.' })
  async deletePromotion(@Param('id') id: string) {
    return await this.promotionsService.deletePromotion(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post(':id/claim')
  @ApiOperation({ summary: 'Claim a promotion (CUSTOMER only)' })
  @ApiResponse({ status: 201, description: 'Promotion claimed.' })
  async claimPromotion(@Param('id') id: string, @Request() req: RequestWithUser) {
    return await this.promotionsService.claimPromotion(id, req.user);
  }
}
