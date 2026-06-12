import { IsString, IsOptional, IsInt, IsBoolean, Min, IsIn } from 'class-validator';

export class CreateLevelDto {
  @IsString()
  merchantId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minPoints?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minVisits?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  badgeUrl?: string;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsIn(['SYSTEM', 'CUSTOM'])
  skinType?: string;

  @IsOptional()
  skinConfig?: Record<string, unknown>;

  @IsOptional()
  benefits?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLevelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minPoints?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minVisits?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  badgeUrl?: string;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @IsOptional()
  @IsIn(['SYSTEM', 'CUSTOM'])
  skinType?: string;

  @IsOptional()
  skinConfig?: Record<string, unknown>;

  @IsOptional()
  benefits?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
