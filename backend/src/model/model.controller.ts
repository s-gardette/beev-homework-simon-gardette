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
import { ModelService } from './model.service';
import { Model } from './model.entities';
import { CreateModelDto } from './dto/model.dto';

@ApiTags('models')
@Controller('models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicle models' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicle models',
    type: Model,
    isArray: true,
  })
  async findAll(): Promise<Model[]> {
    return this.modelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle model by id' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle model id (uuid)',
  })
  @ApiResponse({
    status: 200,
    description: 'The vehicle model',
    type: Model,
  })
  async findOne(@Param('id') id: string): Promise<Model | null> {
    return this.modelService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle model' })
  @ApiBody({ type: CreateModelDto })
  @ApiResponse({
    status: 201,
    description: 'The created vehicle model',
    type: Model,
  })
  @ApiBadRequestResponse({ description: 'Bad Request — validation failed' })
  async create(@Body() modelData: CreateModelDto): Promise<Model> {
    return this.modelService.create(modelData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vehicle model' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle model id (uuid)',
  })
  @ApiBody({ type: Model })
  @ApiResponse({
    status: 200,
    description: 'The updated vehicle model',
    type: Model,
  })
  async update(
    @Param('id') id: string,
    @Body() modelData: Partial<Model>,
  ): Promise<Model | null> {
    return this.modelService.update(id, modelData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle model' })
  @ApiParam({
    name: 'id',
    description: 'Vehicle model id (uuid)',
  })
  @ApiResponse({
    status: 204,
    description: 'The vehicle model has been deleted',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.modelService.delete(id);
  }
}
