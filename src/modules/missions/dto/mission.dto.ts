import { IsString, IsOptional, IsInt, Min, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { MissionType, MissionRepeat } from '@prisma/client';

export class CreateMissionDto {
  @IsString()
  merchantId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MissionType)
  type?: MissionType;

  @IsOptional()
  @IsEnum(MissionRepeat)
  repeat?: MissionRepeat;

  @IsOptional()
  @IsInt()
  @Min(1)
  goalValue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rewardPoints?: number;

  @IsOptional()
  @IsString()
  rewardCouponId?: string;

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

export class UpdateMissionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MissionType)
  type?: MissionType;

  @IsOptional()
  @IsEnum(MissionRepeat)
  repeat?: MissionRepeat;

  @IsOptional()
  @IsInt()
  @Min(1)
  goalValue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rewardPoints?: number;

  @IsOptional()
  @IsString()
  rewardCouponId?: string;

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
