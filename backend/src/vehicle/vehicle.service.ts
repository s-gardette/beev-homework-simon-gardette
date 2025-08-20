import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entities';
import { VehicleStatusEnum } from './vehicle.entities';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async findAll(
    brandId?: string,
    modelId?: string,
    status?: VehicleStatusEnum,
  ): Promise<Vehicle[]> {
    const qb = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.vehicleBrand', 'brand')
      .leftJoinAndSelect('vehicle.vehicleModel', 'model')
      .leftJoinAndSelect('vehicle.vehicleStatus', 'status');

    if (brandId) {
      qb.andWhere('vehicle.vehicleBrandId = :brandId', { brandId });
    }

    if (modelId) {
      qb.andWhere('model.name = :model', { modelId });
    }

    if (status) {
      qb.andWhere('status.status = :status', { status });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOneBy({ id });
  }

  async create(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(vehicleData);
    return this.vehicleRepository.save(vehicle);
  }

  async update(
    id: string,
    vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    await this.vehicleRepository.update(id, vehicleData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
