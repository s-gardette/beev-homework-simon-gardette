import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle, VehicleStatus } from './vehicle.entities';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleStatus])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
