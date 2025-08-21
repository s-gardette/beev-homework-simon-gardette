import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BrandAnalyticsView,
  ModelEfficiencyView,
  EmissionsByDriveTypeView,
  FleetCompositionView,
  FleetOperationalView,
} from './analytics.entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(BrandAnalyticsView)
    private readonly brandRepository: Repository<BrandAnalyticsView>,

    @InjectRepository(ModelEfficiencyView)
    private readonly modelRepo: Repository<ModelEfficiencyView>,

    @InjectRepository(EmissionsByDriveTypeView)
    private readonly emissionsRepo: Repository<EmissionsByDriveTypeView>,

    @InjectRepository(FleetCompositionView)
    private readonly compositionRepo: Repository<FleetCompositionView>,

    @InjectRepository(FleetOperationalView)
    private readonly operationalRepo: Repository<FleetOperationalView>,
  ) {}

  async getBrandAnalytics(): Promise<BrandAnalyticsView[]> {
    return this.brandRepository.find();
  }

  async getFleetEfficiency(): Promise<ModelEfficiencyView[]> {
    return this.modelRepo.find();
  }

  async getEmissionsByDriveType(): Promise<EmissionsByDriveTypeView[]> {
    return this.emissionsRepo.find();
  }

  async getFleetComposition(): Promise<FleetCompositionView[]> {
    return this.compositionRepo.find();
  }

  async getFleetOperational(): Promise<FleetOperationalView[]> {
    return this.operationalRepo.find();
  }
}
