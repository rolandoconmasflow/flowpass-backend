import { IsString } from 'class-validator';

export class GeneratePassDto {
  @IsString()
  membershipId!: string;
}
