import { IsString, IsOptional, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';

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
  @IsInt()
  @Min(0)
  requiredPoints?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredVisits?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
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
  @IsInt()
  @Min(0)
  requiredPoints?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredVisits?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
