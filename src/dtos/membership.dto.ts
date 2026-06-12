import { IsString } from 'class-validator';

export class JoinMerchantDto {
  @IsString()
  merchantId!: string;
}
