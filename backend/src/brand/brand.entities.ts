import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from '@/utils/database-utils';
import { Vehicle } from '@/vehicle/vehicle.entities';
import { Model } from '@/model/model.entities';

@Entity()
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.brand)
  vehicles: Relation<Vehicle[]>;

  @OneToMany(() => Model, (model) => model.Brand)
  models: Relation<Model[]>;
}
