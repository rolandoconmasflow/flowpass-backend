import { Injectable, BadRequestException } from '@nestjs/common';
import { join, extname } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import sharp from 'sharp';

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class UploadsService {
  private readonly uploadsDir = join(__dirname, '..', '..', '..', 'uploads');

  constructor() {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(file: UploadFile): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed');
    }

    const ext = extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filepath = join(this.uploadsDir, filename);

    if (!file.buffer) {
      throw new BadRequestException('File buffer is empty');
    }

    const processed = await sharp(file.buffer).resize({ width: 1200, withoutEnlargement: true }).toBuffer();

    writeFileSync(filepath, processed as unknown as string);

    return `/uploads/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = join(this.uploadsDir, filename);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
    }
  }
}
