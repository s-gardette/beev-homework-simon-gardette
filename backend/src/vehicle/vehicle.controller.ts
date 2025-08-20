import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleStatusEnum } from './vehicle.entities';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  async findAll(
    @Query('brand') brandId?: string,
    @Query('model') modelId?: string,
    @Query('status') status?: VehicleStatusEnum,
  ): Promise<Vehicle[]> {
    return this.vehicleService.findAll(brandId, modelId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vehicle | null> {
    return this.vehicleService.findOne(id);
  }

  @Post()
  async create(@Body() vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.vehicleService.create(vehicleData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    return this.vehicleService.update(id, vehicleData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.vehicleService.delete(id);
  }
}
