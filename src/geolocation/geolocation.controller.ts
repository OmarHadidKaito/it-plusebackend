import { Controller, Post, Body } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';

@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Post()
  async getGeolocation(@Body('address') address: string) {
    return this.geolocationService.findGeolocation(address);
  }
}
