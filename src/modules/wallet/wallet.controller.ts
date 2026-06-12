import { Controller, Get, Post, Param, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GeneratePassDto } from '../../dtos/wallet.dto';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my wallet passes' })
  @ApiResponse({ status: 200, description: 'Wallet passes returned.' })
  async getMyCards(@Request() req) {
    return this.walletService.getMyCards(req.user.id);
  }

  @Post('generate-pass')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate a wallet pass' })
  @ApiResponse({ status: 201, description: 'Wallet pass generated.' })
  async generatePass(@Request() req, @Body() generatePassDto: GeneratePassDto) {
    return this.walletService.generatePass(req.user.id, generatePassDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get wallet pass by ID' })
  @ApiResponse({ status: 200, description: 'Wallet pass found.' })
  async getPassById(@Param('id') id: string) {
    return this.walletService.getPassById(id);
  }

  @Patch(':id/revoke')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Revoke a wallet pass' })
  @ApiResponse({ status: 200, description: 'Wallet pass revoked.' })
  async revokePass(@Param('id') id: string) {
    return this.walletService.revokePass(id);
  }
}
