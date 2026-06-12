import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ description: 'ID del plan de suscripción a contratar' })
  @IsString()
  @IsNotEmpty()
  planId!: string;
}
