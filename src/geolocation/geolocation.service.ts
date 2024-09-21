import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geolocation } from './entities/geolocation.entity';
import axios from 'axios';
import { CreateGeolocationDto } from './dto/create-geolocation.dto';

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(Geolocation)
    private geolocationRepository: Repository<Geolocation>,
  ) {}

  async findGeolocation(
    createGeolocationDto: CreateGeolocationDto,
  ): Promise<Geolocation> {
    const { address, email } = createGeolocationDto;

    const existingLocation = await this.geolocationRepository.findOne({
      where: { address },
    });
    if (existingLocation) {
      return existingLocation;
    }

    // Fetch from external API
    try {
      const apiKey = process.env.GEOCODE_API_KEY;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: address,
            key: apiKey,
          },
        },
      );

      const { lat, lng } = response.data.results[0].geometry;
      const newLocation = this.geolocationRepository.create({
        address,
        email,
        latitude: lat,
        longitude: lng,
      });
      await this.geolocationRepository.save(newLocation);

      return newLocation;
    } catch {
      throw new HttpException('Error fetching data', HttpStatus.BAD_REQUEST);
    }
  }
}
