import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Vehicle,
  VehicleStatus,
  VehicleBrand,
  VehicleModel,
} from './vehicle.entities';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      VehicleStatus,
      VehicleBrand,
      VehicleModel,
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
