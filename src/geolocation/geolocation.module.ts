import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeolocationService } from './geolocation.service';
import { GeolocationController } from './geolocation.controller';
import { Geolocation } from './entities/geolocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Geolocation])],
  providers: [GeolocationService],
  controllers: [GeolocationController],
})
export class GeolocationModule {}
