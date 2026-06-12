import { IsString, IsOptional, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';

export class CreateRaffleDto {
  @IsString()
  merchantId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  prize!: string;

  @IsOptional()
  @IsString()
  prizeImage?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  entryCost?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxEntries?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRaffleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  prize?: string;

  @IsOptional()
  @IsString()
  prizeImage?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  entryCost?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxEntries?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
