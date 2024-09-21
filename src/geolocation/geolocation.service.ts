import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geolocation } from './entities/geolocation.entity';
import axios from 'axios';

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(Geolocation)
    private geolocationRepository: Repository<Geolocation>,
  ) {}

  async findGeolocation(address: string): Promise<Geolocation> {
    // Check the database
    const existingLocation = await this.geolocationRepository.findOne({
      where: { address },
    });
    if (existingLocation) {
      return existingLocation;
    }

    // Fetch from external API
    const apiKey = process.env.GEOCODE_API_KEY; // e.g., OpenCage API key
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

    // Save to database
    const newLocation = this.geolocationRepository.create({
      address,
      latitude: lat,
      longitude: lng,
    });
    await this.geolocationRepository.save(newLocation);

    return newLocation;
  }
}
