import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './model.entities';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async findAll(): Promise<Model[]> {
    return this.modelRepository.find();
  }

  async findOne(id: string): Promise<Model | null> {
    return this.modelRepository.findOneBy({ id });
  }

  async create(modelData: Partial<Model>): Promise<Model> {
    const model = this.modelRepository.create(modelData);
    return this.modelRepository.save(model);
  }

  async update(id: string, modelData: Partial<Model>): Promise<Model | null> {
    await this.modelRepository.update(id, modelData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.modelRepository.delete(id);
  }
}
