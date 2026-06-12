import { IsString, IsOptional, IsInt, Min, IsObject } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  merchantId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsObject()
  criteria?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsObject()
  criteria?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;
}
