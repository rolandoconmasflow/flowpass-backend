import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { LocationsService } from './locations.service';
import { QrService } from '../qr/qr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SubscriptionGuard } from '../billing/subscription.guard';
import { CreateLocationDto, UpdateLocationDto } from '../../dtos/location.dto';

@ApiTags('Locations')
@ApiBearerAuth()
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly qrService: QrService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all locations' })
  @ApiResponse({ status: 200, description: 'Locations returned.' })
  async findAll() {
    return await this.locationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby locations by GPS coordinates' })
  @ApiResponse({ status: 200, description: 'Nearby locations returned.' })
  async findNearby(@Query('lat') lat: string, @Query('lng') lng: string, @Query('radius') radius?: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = radius ? parseFloat(radius) : 10;
    return await this.locationsService.findNearby(latitude, longitude, radiusKm);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, description: 'Location found.' })
  async findOne(@Param('id') id: string) {
    return await this.locationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post()
  @ApiOperation({ summary: 'Create a location' })
  @ApiResponse({ status: 201, description: 'Location created.' })
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationsService.create(createLocationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Post(':id/generate-qr')
  @ApiOperation({ summary: 'Generate QR code for a location' })
  @ApiResponse({ status: 201, description: 'QR generated.' })
  async generateQr(@Param('id') id: string) {
    return await this.qrService.generateQRForLocation(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a location' })
  @ApiResponse({ status: 200, description: 'Location updated.' })
  async update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return await this.locationsService.update(id, updateLocationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MERCHANT_OWNER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location' })
  @ApiResponse({ status: 200, description: 'Location deleted.' })
  async remove(@Param('id') id: string) {
    return await this.locationsService.remove(id);
  }
}
