import { IsString, IsEnum } from 'class-validator';
import { DevicePlatform } from '@prisma/client';

export class RegisterDeviceDto {
  @IsEnum(DevicePlatform)
  platform!: DevicePlatform;

  @IsString()
  pushToken!: string;
}