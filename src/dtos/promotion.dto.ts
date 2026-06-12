import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { DiscountType, RedemptionMode } from '@prisma/client';

export class CreatePromotionDto {
  @IsString()
  merchantId!: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  maxClaims?: number;

  @IsOptional()
  @IsNumber()
  maxClaimsPerCustomer?: number;

  @IsOptional()
  @IsEnum(RedemptionMode)
  redemptionMode?: RedemptionMode;

  @IsOptional()
  @IsDateString()
  claimStartsAt?: string;

  @IsOptional()
  @IsDateString()
  claimEndsAt?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  maxClaims?: number;

  @IsOptional()
  @IsNumber()
  maxClaimsPerCustomer?: number;

  @IsOptional()
  @IsEnum(RedemptionMode)
  redemptionMode?: RedemptionMode;

  @IsOptional()
  @IsDateString()
  claimStartsAt?: string;

  @IsOptional()
  @IsDateString()
  claimEndsAt?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
