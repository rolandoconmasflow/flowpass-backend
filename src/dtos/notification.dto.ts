import { IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  merchantId?: string;
}

export class SendNotificationDto {
  @IsString()
  userId!: string;

  @IsString()
  title!: string;

  @IsString()
  body!: string;
}
