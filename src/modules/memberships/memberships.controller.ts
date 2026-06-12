import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MembershipsService } from './memberships.service';
import { JoinMerchantDto } from '../../dtos/membership.dto';

@ApiTags('Memberships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get own memberships' })
  @ApiResponse({ status: 200, description: 'Memberships returned.' })
  async getMyMemberships(@Request() req) {
    const userId = req.user.id;
    const customerProfile = await this.membershipsService.findCustomerProfile(userId);
    if (!customerProfile) {
      return { message: 'Perfil de cliente no encontrado', memberships: [] };
    }
    return await this.membershipsService.getCustomerMemberships(customerProfile.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership found.' })
  async getMembership(@Param('id') membershipId: string) {
    return await this.membershipsService.getMembershipById(membershipId);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a merchant loyalty program' })
  @ApiResponse({ status: 201, description: 'Membership created.' })
  async joinMerchant(@Request() req, @Body() dto: JoinMerchantDto) {
    const userId = req.user.id;
    const customerProfile = await this.membershipsService.findCustomerProfile(userId);
    if (!customerProfile) {
      return { message: 'Perfil de cliente no encontrado' };
    }
    const loyaltyProgramId = 'temp-loyalty-program-id';

    return await this.membershipsService.createMembership(customerProfile.id, dto.merchantId, loyaltyProgramId);
  }

  @Get('card/:id')
  @ApiOperation({ summary: 'Get customer loyalty card' })
  @ApiResponse({ status: 200, description: 'Card returned.' })
  async getCustomerCard(@Param('id') _membershipId: string) {
    return { message: 'Tarjeta de cliente' };
  }

  @Get('cards')
  @ApiOperation({ summary: 'Get all customer loyalty cards' })
  @ApiResponse({ status: 200, description: 'Cards returned.' })
  async getCustomerCards(@Request() req) {
    const userId = req.user.id;
    const customerProfile = await this.membershipsService.findCustomerProfile(userId);
    if (!customerProfile) {
      return { message: 'Perfil de cliente no encontrado', cards: [] };
    }
    return { message: 'Tarjetas de cliente' };
  }
}
