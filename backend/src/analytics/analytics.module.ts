import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BrandAnalyticsView,
  ModelEfficiencyView,
  EmissionsByDriveTypeView,
  FleetCompositionView,
  FleetOperationalView,
} from './analytics.entities';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrandAnalyticsView,
      ModelEfficiencyView,
      EmissionsByDriveTypeView,
      FleetCompositionView,
      FleetOperationalView,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
