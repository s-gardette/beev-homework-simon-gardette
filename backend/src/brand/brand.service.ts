import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entities';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }

  async findOne(id: string): Promise<Brand | null> {
    return this.brandRepository.findOneBy({ id });
  }

  async create(brandData: Partial<Brand>): Promise<Brand> {
    const brand = this.brandRepository.create(brandData);
    return this.brandRepository.save(brand);
  }

  async update(id: string, brandData: Partial<Brand>): Promise<Brand | null> {
    await this.brandRepository.update(id, brandData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.brandRepository.delete(id);
  }
}
