import { Controller, Get, Post, Inject } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
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
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('brands')
  @CacheTTL(1000 * 60 * 5) // Cache for 5 minutes
  @ApiOperation({
    summary: 'Get brand analytics (avg charge, consumption, battery capacity)',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand analytics',
    type: BrandAnalyticsView,
    isArray: false,
  })
  async getBrandAnalytics(): Promise<BrandAnalyticsView[]> {
    return this.analyticsService.getBrandAnalytics();
  }

  @Get('fleet-efficiency')
  @ApiOperation({
    summary: 'Get fleet efficiency and emissions',
  })
  @CacheTTL(1000 * 60 * 5) // Cache for 5 minutes
  @ApiResponse({
    status: 200,
    description: 'Model efficiency list',
    type: ModelEfficiencyView,
    isArray: false,
  })
  async getFleetEfficiency(): Promise<ModelEfficiencyView[]> {
    return this.analyticsService.getFleetEfficiency();
  }

  @Get('fleet-emissions')
  @CacheTTL(1000 * 60 * 5) // Cache for 5 minutes
  @ApiOperation({
    summary: 'Get emissions comparison between BEV and ICE',
  })
  @ApiResponse({
    status: 200,
    description: 'Emissions by drive type',
    type: EmissionsByDriveTypeView,
    isArray: false,
  })
  async getFleetEmissions(): Promise<EmissionsByDriveTypeView[]> {
    return this.analyticsService.getEmissionsByDriveType();
  }

  @Get('fleet-composition')
  @CacheTTL(1000 * 60 * 120) // Cache for 2 Hours
  @ApiOperation({
    summary: 'Get fleet composition BEV vs ICE',
  })
  @ApiResponse({
    status: 200,
    description: 'Fleet composition',
    type: FleetCompositionView,
    isArray: false,
  })
  async getFleetComposition(): Promise<FleetCompositionView[]> {
    return this.analyticsService.getFleetComposition();
  }

  @Get('fleet-operational')
  @CacheTTL(1000 * 60 * 1) // Cache for 1 minutes
  @ApiOperation({
    summary: 'Get fleet operational metrics (availability, charging, in use)',
  })
  @ApiResponse({
    status: 200,
    description: 'Fleet operational metrics',
    type: FleetOperationalView,
    isArray: false,
  })
  async getFleetOperational(): Promise<FleetOperationalView[]> {
    return this.analyticsService.getFleetOperational();
  }

  @Post('cache/clear')
  @ApiOperation({ summary: 'Clear analytics cache' })
  @ApiResponse({ status: 200, description: 'Cache cleared' })
  async clearCache(): Promise<{ ok: boolean }> {
    // clear the underlying cache store (typed)
    await this.cacheManager.clear();
    return { ok: true };
  }
}
