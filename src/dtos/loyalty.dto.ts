import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min } from 'class-validator';
import { LoyaltyProgramType } from '@prisma/client';

export class CreateLoyaltyProgramDto {
  @IsString()
  merchantId!: string;

  @IsString()
  name!: string;

  @IsEnum(LoyaltyProgramType)
  type!: LoyaltyProgramType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pointsPerVisit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  visitsRequiredForReward?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLoyaltyProgramDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(LoyaltyProgramType)
  type?: LoyaltyProgramType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pointsPerVisit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  visitsRequiredForReward?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateRewardDto {
  @IsString()
  merchantId!: string;

  @IsOptional()
  @IsString()
  loyaltyProgramId?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  requiredPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  requiredVisits?: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validTo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRewardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  requiredPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  requiredVisits?: number;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validTo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
