import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Relation,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/utils/database-utils';
import { Brand } from '@/brand/brand.entities';
import { Model } from '@/model/model.entities';

export enum VehicleStatusEnum {
  InUse = 'in_use',
  Available = 'available',
  Charging = 'charging',
}

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  externalId: string | null;

  @Column({ length: 200 })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.vehicles)
  brand: Relation<Brand>;

  @ManyToOne(() => Model, (model) => model.vehicles)
  model: Relation<Model>;

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
    type: 'simple-enum',
    enum: VehicleStatusEnum,
    default: VehicleStatusEnum.Available,
  })
  status: VehicleStatusEnum;

  // Make VehicleStatus the owning side of the relation by defining the join column here
  @OneToOne(() => Vehicle, (vehicle) => vehicle.vehicleStatus)
  @JoinColumn()
  vehicle: Relation<Vehicle>;
}
