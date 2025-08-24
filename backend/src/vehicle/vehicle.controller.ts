import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
  NotFoundException,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleStatusEnum, VehicleStatus } from './vehicle.entities';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  UpdateVehicleStatusDto,
} from './dto/vehicle.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles' })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: Object.values(VehicleStatusEnum),
  })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles',
    type: Vehicle,
    isArray: true,
  })
  async findAll(
    @Query('brand') brandId?: string,
    @Query('model') modelId?: string,
    @Query('status') status?: VehicleStatusEnum,
  ): Promise<Vehicle[]> {
    return this.vehicleService.findAll(brandId, modelId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by id' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle id (uuid)',
  })
  @ApiResponse({
    status: 200,
    description: 'The vehicle',
    type: Vehicle,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleService.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id=${id} not found`);
    }
    return vehicle;
  }

  @Post()
  @ApiOperation({ summary: 'Create a vehicle' })
  @ApiBody({
    type: CreateVehicleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created',
    type: Vehicle,
  })
  async create(@Body() vehicleData: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.create(vehicleData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle id (uuid)',
  })
  @ApiBody({
    type: UpdateVehicleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Updated vehicle',
    type: Vehicle,
  })
  async update(
    @Param('id') id: string,
    @Body() vehicleData: UpdateVehicleDto,
  ): Promise<Vehicle | null> {
    return this.vehicleService.update(id, vehicleData as Partial<Vehicle>);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle id (uuid)',
  })
  @ApiResponse({
    status: 204,
    description: 'Vehicle deleted',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.vehicleService.delete(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: "Update or create a vehicle's status" })
  @ApiParam({ name: 'id', description: 'Vehicle id (uuid)' })
  @ApiBody({ type: UpdateVehicleStatusDto })
  @ApiResponse({
    status: 200,
    description: "The vehicle's status",
    type: VehicleStatus,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() statusData: UpdateVehicleStatusDto,
  ): Promise<VehicleStatus | null> {
    return this.vehicleService.updateStatus(
      id,
      statusData as Partial<VehicleStatus>,
    );
  }
}
