import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from '../../dtos/location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.merchantLocation.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.merchantLocation.findUnique({
      where: { id },
    });
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    const locations = await this.prisma.merchantLocation.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      include: { merchant: true },
    });

    return locations
      .filter((loc) => {
        if (loc.latitude === null || loc.longitude === null) return false;
        const distance = this.haversine(lat, lng, loc.latitude, loc.longitude);
        return distance <= radiusKm;
      })
      .map((loc) => ({
        ...loc,
        distance: this.haversine(lat, lng, loc.latitude!, loc.longitude!),
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async create(data: CreateLocationDto) {
    return await this.prisma.merchantLocation.create({
      data: data as Prisma.MerchantLocationUncheckedCreateInput,
    });
  }

  async update(id: string, data: UpdateLocationDto) {
    return await this.prisma.merchantLocation.update({
      where: { id },
      data: data as Prisma.MerchantLocationUncheckedUpdateInput,
    });
  }

  async remove(id: string) {
    return await this.prisma.merchantLocation.delete({
      where: { id },
    });
  }
}
