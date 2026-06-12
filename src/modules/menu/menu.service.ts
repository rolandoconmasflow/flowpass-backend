import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MenuItem } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UploadsService, UploadFile } from '../uploads/uploads.service';
import {
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  BulkImportItemDto,
} from './dto/menu.dto';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  // ─── Categorías ───────────────────────────────────────────────

  async getFullMenu(merchantId: string, lang?: string) {
    const categories = await this.prisma.menuCategory.findMany({
      where: { merchantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            translations: lang ? { where: { language: lang } } : false,
          },
        },
      },
    });
    return categories;
  }

  async createCategory(dto: CreateMenuCategoryDto) {
    return this.prisma.menuCategory.create({
      data: {
        merchantId: dto.merchantId,
        name: dto.name,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateMenuCategoryDto) {
    const cat = await this.prisma.menuCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.menuCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string) {
    const cat = await this.prisma.menuCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.menuCategory.delete({ where: { id } });
  }

  // ─── Items ─────────────────────────────────────────────────────

  async createItem(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({
      data: {
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        currency: dto.currency ?? 'ARS',
        imageUrl: dto.imageUrl,
        isAvailable: dto.isAvailable ?? true,
        sortOrder: dto.sortOrder ?? 0,
        isBestseller: dto.isBestseller ?? false,
        dietaryTags: dto.dietaryTags ?? [],
      },
      include: { category: true },
    });
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return this.prisma.menuItem.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async deleteItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return this.prisma.menuItem.delete({ where: { id } });
  }

  async uploadItemImage(id: string, file: UploadFile) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');

    // Si ya tenía imagen, borrar la anterior
    if (item.imageUrl) {
      const filename = item.imageUrl.replace('/uploads/', '');
      await this.uploadsService.deleteFile(filename).catch(() => {});
    }

    const url = await this.uploadsService.saveFile(file);

    return this.prisma.menuItem.update({
      where: { id },
      data: { imageUrl: url },
    });
  }

  async getBestsellers(merchantId: string) {
    const categories = await this.prisma.menuCategory.findMany({
      where: { merchantId, isActive: true },
      include: {
        items: {
          where: { isAvailable: true, isBestseller: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    return categories;
  }

  async bulkImport(merchantId: string, items: BulkImportItemDto[]) {
    const results: MenuItem[] = [];

    for (const item of items) {
      let category = await this.prisma.menuCategory.findFirst({
        where: { merchantId, name: item.categoryName },
      });

      if (!category) {
        category = await this.prisma.menuCategory.create({
          data: {
            merchantId,
            name: item.categoryName,
            sortOrder: 0,
          },
        });
      }

      const created = await this.prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          currency: item.currency ?? 'ARS',
          isAvailable: item.isAvailable ?? true,
          sortOrder: item.sortOrder ?? 0,
          isBestseller: item.isBestseller ?? false,
          dietaryTags: item.dietaryTags ?? [],
        },
      });

      results.push(created);
    }

    return { imported: results.length, items: results };
  }
}
