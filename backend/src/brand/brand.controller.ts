import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { Brand } from './brand.entities';
import { CreateBrandDto } from './dto/brand.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @CacheTTL(1000 * 60 * 3600) // Cache for 1 day
  @ApiOperation({ summary: 'List vehicle brands' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicle brands',
    type: Brand,
    isArray: true,
  })
  async findAll(): Promise<Brand[]> {
    return this.brandService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle brand by id' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle brand id (uuid)',
  })
  @ApiResponse({
    status: 200,
    description: 'The vehicle brand',
    type: Brand,
  })
  async findOne(@Param('id') id: string): Promise<Brand | null> {
    return this.brandService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle brand' })
  @ApiBody({
    type: CreateBrandDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The created vehicle brand',
    type: Brand,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request — validation failed. Example: missing or empty `name` field',
  })
  async create(@Body() brandData: CreateBrandDto): Promise<Brand> {
    return this.brandService.create(brandData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle brand' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle brand id (uuid)',
  })
  @ApiBody({ type: Brand })
  @ApiResponse({
    status: 200,
    description: 'The updated vehicle brand',
    type: Brand,
  })
  async update(
    @Param('id') id: string,
    @Body() brandData: Partial<Brand>,
  ): Promise<Brand | null> {
    return this.brandService.update(id, brandData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle brand' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle brand id (uuid)',
  })
  @ApiResponse({
    status: 204,
    description: 'The vehicle brand has been deleted',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.brandService.delete(id);
  }
}
