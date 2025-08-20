import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from '@/utils/database-utils';

export enum VehicleStatusEnum {
  InUse = 'in_use',
  Available = 'available',
  Charging = 'charging',
}

export enum VehicleTypeEnum {
  BEV = 'BEV', // Battery Electric Vehicle
  ICE = 'ICE', // Internal Combustion Engine
}

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ type: 'int' })
  views: number;

  @ManyToOne(() => VehicleBrand, (vehicleBrand) => vehicleBrand.vehicles)
  vehicleBrand: Relation<VehicleBrand>;

  @ManyToOne(() => VehicleModel, (vehicleModel) => vehicleModel.vehicles)
  vehicleModel: Relation<VehicleModel>;

  @OneToOne(() => VehicleStatus, (vehicleStatus) => vehicleStatus.vehicle, {
    eager: true,
  })
  vehicleStatus: Relation<VehicleStatus>;
}

@Entity()
export class VehicleStatus extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  currentChargeLevel: number;

  @Column({
    type: 'enum',
    enum: VehicleStatusEnum,
    default: VehicleStatusEnum.Available,
  })
  status: VehicleStatusEnum;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.vehicleStatus)
  vehicle: Relation<Vehicle>;
}

@Entity()
export class VehicleBrand extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleBrand)
  vehicles: Relation<Vehicle[]>;

  @OneToMany(() => VehicleModel, (model) => model.modelBrand)
  vehicleModels: Relation<VehicleModel[]>;
}

@Entity()
export class VehicleModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'int' })
  batteryCapacity: number; // in kWh

  @Column({ type: 'int' })
  averageConsumption: number; // in Wh/km

  @Column({ type: 'int' })
  emissionGCO2: number; // in gCO2/km

  @Column({
    type: 'enum',
    enum: VehicleTypeEnum,
    default: VehicleTypeEnum.BEV,
  })
  vehicleType: VehicleTypeEnum;

  @ManyToOne(() => VehicleBrand, (vehicleBrand) => vehicleBrand.vehicleModels)
  modelBrand: Relation<VehicleBrand>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel)
  vehicles: Relation<Vehicle>[];
}
