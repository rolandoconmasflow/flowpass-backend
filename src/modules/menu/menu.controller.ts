import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { UploadFile } from '../uploads/uploads.service';
import { MenuService } from './menu.service';
import {
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  BulkImportItemDto,
} from './dto/menu.dto';

@ApiTags('Menu Digital')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // ─── Endpoints públicos (sin auth) ────────────────────────────

  @Get(':merchantId')
  @ApiOperation({ summary: 'Get full menu for a merchant (public)' })
  @ApiResponse({ status: 200, description: 'Menu returned.' })
  async getFullMenu(@Param('merchantId') merchantId: string, @Query('lang') lang?: string) {
    return this.menuService.getFullMenu(merchantId, lang);
  }

  @Get(':merchantId/bestsellers')
  @ApiOperation({ summary: 'Get bestseller items (public)' })
  @ApiResponse({ status: 200, description: 'Bestsellers returned.' })
  async getBestsellers(@Param('merchantId') merchantId: string) {
    return this.menuService.getBestsellers(merchantId);
  }

  // ─── CRUD de categorías (solo merchant owner / admin) ─────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('categories')
  @ApiOperation({ summary: 'Create a menu category' })
  @ApiResponse({ status: 201, description: 'Category created.' })
  async createCategory(@Body() dto: CreateMenuCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update a menu category' })
  @ApiResponse({ status: 200, description: 'Category updated.' })
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateMenuCategoryDto) {
    return this.menuService.updateCategory(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a menu category' })
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  async deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id);
  }

  // ─── CRUD de items (solo merchant owner / admin) ──────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('items')
  @ApiOperation({ summary: 'Create a menu item' })
  @ApiResponse({ status: 201, description: 'Item created.' })
  async createItem(@Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiResponse({ status: 200, description: 'Item updated.' })
  async updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.updateItem(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 200, description: 'Item deleted.' })
  async deleteItem(@Param('id') id: string) {
    return this.menuService.deleteItem(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('items/:id/image')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload item image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploaded.' })
  async uploadItemImage(@Param('id') id: string, @UploadedFile() file: UploadFile) {
    return this.menuService.uploadItemImage(id, file);
  }

  // ─── Bulk import ─────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post('bulk-import')
  @ApiOperation({ summary: 'Bulk import menu items from CSV/JSON' })
  @ApiResponse({ status: 201, description: 'Items imported.' })
  async bulkImport(@Body() dto: { merchantId: string; items: BulkImportItemDto[] }) {
    return this.menuService.bulkImport(dto.merchantId, dto.items);
  }
}
