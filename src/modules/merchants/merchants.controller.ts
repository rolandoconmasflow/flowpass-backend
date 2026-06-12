import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadFile } from '../uploads/uploads.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { AuthService } from '../auth/auth.service';
import { MerchantsService } from './merchants.service';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { CreateMerchantDto, UpdateMerchantDto, RegisterMerchantDto } from '../../dtos/merchant.dto';
import { PaginatedQueryDto } from '../../dtos/paginated.dto';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new merchant (public)' })
  @ApiResponse({ status: 201, description: 'Merchant registered.' })
  async register(@Body() dto: RegisterMerchantDto) {
    return this.merchantsService.register(dto);
  }

  @Get('public')
  @ApiOperation({ summary: 'List active merchants (public)' })
  @ApiResponse({ status: 200, description: 'Public merchant list returned.' })
  async findPublic() {
    return this.merchantsService.findPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all merchants' })
  @ApiResponse({ status: 200, description: 'Merchants returned.' })
  async findAll(@Query() query: PaginatedQueryDto) {
    return await this.merchantsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all merchant categories' })
  @ApiResponse({ status: 200, description: 'Categories returned.' })
  async getCategories() {
    return [
      'RESTAURANT',
      'CAFE',
      'FAST_FOOD',
      'BAR',
      'BAKERY',
      'ICE_CREAM',
      'GROCERY',
      'CONVENIENCE',
      'PHARMACY',
      'CLOTHING',
      'ELECTRONICS',
      'BEAUTY',
      'SPORTS',
      'HOME',
      'AUTOMOTIVE',
      'ENTERTAINMENT',
      'HEALTH',
      'EDUCATION',
      'TRAVEL',
      'PETS',
      'BOOKS',
      'PROFESSIONAL_SERVICES',
      'OTHER',
    ];
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Get my active merchant profile' })
  @ApiResponse({ status: 200, description: 'Merchant found.' })
  @ApiResponse({ status: 404, description: 'No tienes un comercio registrado' })
  async getMyMerchant(@Request() req: RequestWithUser) {
    // Si el JWT tiene un activeMerchantId, devolver ese específicamente
    const activeMerchantId = (req.user as any).activeMerchantId;
    if (activeMerchantId) {
      const merchant = await this.merchantsService.findOne(activeMerchantId);
      if (merchant) return merchant;
    }
    // Fallback: buscar el primero
    const merchant = await this.merchantsService.findByOwnerId(req.user.id);
    if (!merchant) {
      throw new NotFoundException('No tienes un comercio registrado');
    }
    return merchant;
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/all')
  @ApiOperation({ summary: 'Get all merchants owned by the current user' })
  @ApiResponse({ status: 200, description: 'Merchants list returned.' })
  async getMyMerchants(@Request() req: RequestWithUser) {
    return await this.merchantsService.findAllByOwnerId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('switch/:id')
  @ApiOperation({ summary: 'Switch active merchant context' })
  @ApiResponse({ status: 200, description: 'Active merchant changed.' })
  @ApiResponse({ status: 404, description: 'Merchant not found or not owned by you' })
  async switchMerchant(@Request() req: RequestWithUser, @Param('id') id: string) {
    const merchant = await this.merchantsService.switchActiveMerchant(req.user.id, id);
    // Generar un nuevo token con el nuevo activeMerchantId
    const access_token = this.authService.signTokenWithMerchant(req.user.id, id);
    return {
      merchant,
      access_token,
      activeMerchantId: id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  @ApiResponse({ status: 200, description: 'Merchant found.' })
  async findOne(@Param('id') id: string) {
    return await this.merchantsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a merchant (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Merchant created.' })
  async create(@Body() createMerchantDto: CreateMerchantDto) {
    return await this.merchantsService.create(createMerchantDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a merchant' })
  @ApiResponse({ status: 200, description: 'Merchant updated.' })
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    // MERCHANT_OWNER solo puede actualizar sus propios merchants
    if (req.user.role === 'MERCHANT_OWNER') {
      await this.merchantsService.switchActiveMerchant(req.user.id, id);
    }
    return await this.merchantsService.update(id, updateMerchantDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.MERCHANT_OWNER, UserRole.SUPER_ADMIN)
  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('logo', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload merchant logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logo uploaded.' })
  async uploadLogo(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @UploadedFile() file: UploadFile,
  ) {
    // MERCHANT_OWNER solo puede subir logo a sus propios merchants
    if (req.user.role === 'MERCHANT_OWNER') {
      await this.merchantsService.switchActiveMerchant(req.user.id, id);
    }
    return this.merchantsService.updateLogo(id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/logo')
  @ApiOperation({ summary: 'Get merchant logo URL' })
  @ApiResponse({ status: 200, description: 'Logo URL returned.' })
  async getLogo(@Param('id') id: string) {
    return this.merchantsService.getLogo(id);
  }
}
