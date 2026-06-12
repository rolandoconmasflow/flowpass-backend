import { IsString, IsOptional, IsInt, IsEnum, IsBoolean, Min, IsDateString } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

export class CreateTableDto {
  @IsString()
  merchantId!: string;

  @IsString()
  label!: string;

  @IsInt()
  @Min(1)
  capacity!: number;
}

export class UpdateTableDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateReservationDto {
  @IsString()
  merchantId!: string;

  @IsString()
  customerId!: string;

  @IsOptional()
  @IsString()
  tableId?: string;

  @IsDateString()
  date!: string;

  @IsString()
  timeSlot!: string;

  @IsInt()
  @Min(1)
  guests!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;
}

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;
}

export class AvailableSlotsQueryDto {
  @IsString()
  merchantId!: string;

  @IsDateString()
  date!: string;
}
