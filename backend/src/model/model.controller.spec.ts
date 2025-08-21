import { Test, TestingModule } from '@nestjs/testing';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Model, TypeEnum } from './model.entities';
import { CreateModelDto } from './dto/model.dto';

export const modelObject: DeepPartial<Model> = {
  id: '550e8400-e29b-41d4-a716-446655440200',
  name: 'Test Model',
  batteryCapacity: 55,
  averageConsumption: 150,
  emissionGCO2: 0,
  Type: TypeEnum.BEV,
};

describe('ModelController', () => {
  let modelController: ModelController;
  let modelService: ModelService;

  beforeEach(async () => {
    const mockModelRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
      providers: [
        ModelService,
        { provide: getRepositoryToken(Model), useValue: mockModelRepo },
      ],
    }).compile();

    modelController = module.get<ModelController>(ModelController);
    modelService = module.get<ModelService>(ModelService);
  });

  describe('findAll', () => {
    it('should return an array of models', async () => {
      const result = [modelObject];
      jest.spyOn(modelService, 'findAll').mockResolvedValue(result as Model[]);
      expect(await modelController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single model', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440200';
      const findSpy = jest
        .spyOn(modelService, 'findOne')
        .mockResolvedValue(modelObject as Model);

      const result = await modelController.findOne(id);
      expect(result).toBe(modelObject);
      expect(findSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new model', async () => {
      const dto: CreateModelDto = {
        name: 'New Model',
        brand: '550e8400-e29b-41d4-a716-446655440100',
        batteryCapacity: 60,
        averageConsumption: 140,
        emissionGCO2: 0,
        Type: TypeEnum.BEV,
      };

      jest
        .spyOn(modelService, 'create')
        .mockResolvedValue(modelObject as Model);

      const result = await modelController.create(dto);
      expect(result).toBe(modelObject);
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update and return the model', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440200';
      const updateData: Partial<Model> = { name: 'Updated Model' };
      const updateSpy = jest
        .spyOn(modelService, 'update')
        .mockResolvedValue(modelObject as Model);

      const result = await modelController.update(id, updateData);
      expect(result).toBe(modelObject);
      expect(updateSpy).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('delete', () => {
    it('should delete the model', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440200';
      const deleteSpy = jest
        .spyOn(modelService, 'delete')
        .mockResolvedValue(undefined);

      const result = await modelController.delete(id);
      expect(result).toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith(id);
    });
  });
});
