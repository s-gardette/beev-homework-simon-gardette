import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from './vehicle.entities';
import { VehicleStatusEnum } from './vehicle.entities';

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
      .leftJoinAndSelect('vehicle.vehicleBrand', 'brand')
      .leftJoinAndSelect('vehicle.vehicleModel', 'model')
      .leftJoinAndSelect('vehicle.vehicleStatus', 'status');

    if (brandId) {
      qb.andWhere('vehicle.vehicleBrandId = :brandId', { brand: brandId });
    }

    if (modelId) {
      qb.andWhere('model.name = :model', { model: modelId });
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

  async create(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    // create vehicle entity from provided data (excluding inline status)
    const { vehicleStatus, ...rest } = vehicleData as unknown as {
      vehicleStatus?: {
        currentChargeLevel?: number;
        status?: VehicleStatusEnum;
      } | null;
      vehicleStatusId?: number | null;
      [k: string]: unknown;
    };

    let vehicle = this.vehicleRepository.create(rest as Partial<Vehicle>);

    // First we save the vehicle to get an Id (necessary for relations)
    vehicle = await this.vehicleRepository.save(vehicle);

    // If vehicule status infos are proveded then when create a new status
    if (vehicleStatus !== undefined && vehicleStatus !== null) {
      const newStatus = this.vehicleStatusRepository.create({
        currentChargeLevel: vehicleStatus.currentChargeLevel ?? 0,
        status: vehicleStatus.status ?? VehicleStatusEnum.Available,
        // link by id only to avoid cascading updates
        vehicle: { id: vehicle.id } as unknown as Vehicle,
      });
      const savedStatus = await this.vehicleStatusRepository.save(newStatus);
      vehicle.vehicleStatus = savedStatus;
      const full = await this.vehicleRepository.findOne({
        where: { id: vehicle.id },
        relations: ['brand', 'model', 'vehicleStatus'],
      });
      return full!;
    }

    const full = await this.vehicleRepository.findOne({
      where: { id: vehicle.id },
      relations: ['brand', 'model', 'vehicleStatus'],
    });
    return full!;
  }

  async updateStatus(
    id: string,
    statusData: Partial<VehicleStatus>,
  ): Promise<VehicleStatus | null> {
    const vehicle = await this.findOne(id);
    if (!vehicle) return null;

    // If vehicle already has a status, update it
    const statusRelation = vehicle.vehicleStatus as unknown as
      | { id?: number }
      | null
      | undefined;
    if (statusRelation && typeof statusRelation.id === 'number') {
      const existing = await this.vehicleStatusRepository.findOneBy({
        id: statusRelation.id,
      });
      if (!existing) return null;
      Object.assign(existing, statusData);
      return this.vehicleStatusRepository.save(existing);
    }

    // Otherwise create a new status and link it to the vehicle
    const newStatus = this.vehicleStatusRepository.create({
      ...statusData,
      // link by id only
      vehicle: { id: vehicle.id } as unknown as Vehicle,
    });
    const saved = await this.vehicleStatusRepository.save(newStatus);
    // attach in-memory for consistency and return the saved status
    vehicle.vehicleStatus = saved;
    return saved;
  }

  async update(
    id: string,
    vehicleData: Partial<Vehicle>,
  ): Promise<Vehicle | null> {
    const vehicle = await this.findOne(id);
    if (!vehicle) return null;

    const { vehicleStatusId, ...rest } = vehicleData as unknown as {
      vehicleStatusId?: number | null;
      [k: string]: unknown;
    };

    // assign other updatable fields
    Object.assign(vehicle, rest);

    if (vehicleStatusId !== undefined) {
      if (vehicleStatusId === null) {
        (vehicle as unknown as { vehicleStatus: null }).vehicleStatus = null;
      } else {
        const status = await this.vehicleStatusRepository.findOneBy({
          id: vehicleStatusId,
        });
        if (!status) {
          throw new NotFoundException(
            `VehicleStatus with id=${vehicleStatusId} not found`,
          );
        }
        vehicle.vehicleStatus = status;
      }
    }

    return this.vehicleRepository.save(vehicle);
  }

  async delete(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
