import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from './vehicle.entities';
import { VehicleStatusEnum } from './vehicle.entities';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  UpdateVehicleStatusDto,
} from './dto/vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleStatus)
    private readonly vehicleStatusRepository: Repository<VehicleStatus>,
  ) {}

  async findAll(
    brandId?: string,
    modelId?: string,
    status?: VehicleStatusEnum,
  ): Promise<Vehicle[]> {
    const qb = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.brand', 'brand')
      .leftJoinAndSelect('vehicle.model', 'model')
      .leftJoinAndSelect('vehicle.vehicleStatus', 'status');

    if (brandId) {
      qb.andWhere('brand.id = :brandId', { brandId });
    }

    if (modelId) {
      qb.andWhere('model.id = :modelId', { modelId });
    }

    if (status) {
      qb.andWhere('status.status = :status', { status });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Vehicle | null> {
    return this.vehicleRepository.findOne({
      where: { id },
      relations: ['brand', 'model', 'vehicleStatus'],
    });
  }

  async create(vehicleData: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(vehicleData);
    return this.vehicleRepository.save(vehicle);
  }

  async update(
    id: string,
    vehicleData: UpdateVehicleDto,
  ): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepository.preload({
      id,
      ...vehicleData,
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id=${id} not found`);
    }
    return this.vehicleRepository.save(vehicle);
  }

  async updateStatus(
    id: string,
    statusData: UpdateVehicleStatusDto,
  ): Promise<VehicleStatus | null> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id=${id} not found`);
    }

    if (vehicle.vehicleStatus) {
      const updatedStatus = await this.vehicleStatusRepository.save({
        ...vehicle.vehicleStatus,
        ...statusData,
      });
      return updatedStatus;
    } else {
      const newStatus = this.vehicleStatusRepository.create({
        ...statusData,
        vehicle: vehicle,
      });
      const savedStatus = await this.vehicleStatusRepository.save(newStatus);
      return savedStatus;
    }
  }

  async delete(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id=${id} not found`);
    }
    if (vehicle.vehicleStatus) {
      await this.vehicleStatusRepository.delete(vehicle.vehicleStatus.id);
    }
    const result = await this.vehicleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vehicle with id=${id} not found`);
    }
  }
}
