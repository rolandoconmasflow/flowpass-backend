import { IsString, IsOptional, IsEnum, IsNumber, IsEmail } from 'class-validator';
import { MerchantCategory } from '@prisma/client';

export class CreateMerchantDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

export class RegisterMerchantDto {
  @IsString()
  businessName!: string;

  @IsEnum(MerchantCategory)
  category!: MerchantCategory;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsEmail()
  ownerEmail!: string;

  @IsString()
  ownerPassword!: string;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  country!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateMerchantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
