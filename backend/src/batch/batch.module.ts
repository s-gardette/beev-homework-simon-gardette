import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '@/brand/brand.entities';
import { Model } from '@/model/model.entities';
import { Vehicle, VehicleStatus } from '@/vehicle/vehicle.entities';
import { BatchService } from './batch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Model, Vehicle, VehicleStatus])],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
