import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { MarketingService } from './marketing.service';

class WaitlistDto {
  @IsEmail()
  email!: string;
}

@ApiTags('Marketing')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('waitlist')
  @ApiOperation({ summary: 'Join the waitlist (public)' })
  @ApiResponse({ status: 201, description: 'Email added to waitlist.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  async joinWaitlist(@Body() dto: WaitlistDto) {
    return this.marketingService.joinWaitlist(dto.email);
  }
}
