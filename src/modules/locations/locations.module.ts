import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { QrModule } from '../qr/qr.module';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  imports: [DatabaseModule, QrModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
