import { Module } from '@nestjs/common';
import { AmbushLocationService } from './ambush-location.service';
import { AmbushLocationController } from './ambush-location.controller';
import { AmbushLocation } from './entities/ambush-location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AmbushLocation])],
  controllers: [AmbushLocationController],
  providers: [AmbushLocationService],
})
export class AmbushLocationModule {}
