import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from '@/utils/database-utils';
import { Vehicle } from '@/vehicle/vehicle.entities';
import { Brand } from '@/brand/brand.entities';

export enum TypeEnum {
  BEV = 'BEV', // Battery Electric Vehicle
  ICE = 'ICE', // Internal Combustion Engine
}

@Entity()
export class Model extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'int' })
  batteryCapacity: number; // in kWh

  @Column({ type: 'float' })
  averageConsumption: number; // in Wh/km

  @Column({ type: 'float' })
  emissionGCO2: number; // in gCO2/km

  @Column({
    type: 'enum',
    enum: TypeEnum,
    default: TypeEnum.BEV,
  })
  Type: TypeEnum;

  @ManyToOne(() => Brand, (brand) => brand.models)
  Brand: Relation<Brand>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.model)
  vehicles: Relation<Vehicle>[];
}
