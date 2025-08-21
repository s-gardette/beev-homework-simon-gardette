import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  BrandAnalyticsView,
  ModelEfficiencyView,
  EmissionsByDriveTypeView,
  FleetCompositionView,
  FleetOperationalView,
} from './analytics.entities';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('brands')
  @ApiOperation({
    summary: 'Get brand analytics (avg charge, consumption, battery capacity)',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand analytics',
    type: BrandAnalyticsView,
    isArray: true,
  })
  async getBrandAnalytics(): Promise<BrandAnalyticsView[]> {
    return this.analyticsService.getBrandAnalytics();
  }

  @Get('fleet-efficiency')
  @ApiOperation({
    summary: 'Get fleet efficiency and emissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Model efficiency list',
    type: ModelEfficiencyView,
    isArray: true,
  })
  async getFleetEfficiency(): Promise<ModelEfficiencyView[]> {
    return this.analyticsService.getFleetEfficiency();
  }

  @Get('fleet-emissions')
  @ApiOperation({
    summary: 'Get emissions comparison between BEV and ICE',
  })
  @ApiResponse({
    status: 200,
    description: 'Emissions by drive type',
    type: EmissionsByDriveTypeView,
    isArray: true,
  })
  async getFleetEmissions(): Promise<EmissionsByDriveTypeView[]> {
    return this.analyticsService.getEmissionsByDriveType();
  }

  @Get('fleet-composition')
  @ApiOperation({
    summary: 'Get fleet composition BEV vs ICE',
  })
  @ApiResponse({
    status: 200,
    description: 'Fleet composition',
    type: FleetCompositionView,
    isArray: true,
  })
  async getFleetComposition(): Promise<FleetCompositionView[]> {
    return this.analyticsService.getFleetComposition();
  }

  @Get('fleet-operational')
  @ApiOperation({
    summary: 'Get fleet operational metrics (availability, charging, in use)',
  })
  @ApiResponse({
    status: 200,
    description: 'Fleet operational metrics',
    type: FleetOperationalView,
    isArray: true,
  })
  async getFleetOperational(): Promise<FleetOperationalView[]> {
    return this.analyticsService.getFleetOperational();
  }
}
