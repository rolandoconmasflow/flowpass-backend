import { Module } from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { RafflesController } from './raffles.controller';

@Module({
  controllers: [RafflesController],
  providers: [RafflesService],
  exports: [RafflesService],
})
export class RafflesModule {}
