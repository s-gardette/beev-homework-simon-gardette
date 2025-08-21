import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Brand } from './brand.entities';
import { CreateBrandDto } from './dto/brand.dto';

export const brandObject: DeepPartial<Brand> = {
  id: '550e8400-e29b-41d4-a716-446655440100',
  name: 'Test Brand',
};

describe('BrandController', () => {
  let brandController: BrandController;
  let brandService: BrandService;

  beforeEach(async () => {
    const mockBrandRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        BrandService,
        { provide: getRepositoryToken(Brand), useValue: mockBrandRepo },
      ],
    }).compile();

    brandController = module.get<BrandController>(BrandController);
    brandService = module.get<BrandService>(BrandService);
  });

  describe('findAll', () => {
    it('should return an array of brands', async () => {
      const result = [brandObject];
      jest.spyOn(brandService, 'findAll').mockResolvedValue(result as Brand[]);
      expect(await brandController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single brand', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440100';
      const findSpy = jest
        .spyOn(brandService, 'findOne')
        .mockResolvedValue(brandObject as Brand);

      const result = await brandController.findOne(id);
      expect(result).toBe(brandObject);
      expect(findSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new brand', async () => {
      const dto: CreateBrandDto = { name: 'New Brand' };
      jest
        .spyOn(brandService, 'create')
        .mockResolvedValue(brandObject as Brand);

      const result = await brandController.create(dto);
      expect(result).toBe(brandObject);
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update and return the brand', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440100';
      const updateData: Partial<Brand> = { name: 'Updated Brand' };
      const updateSpy = jest
        .spyOn(brandService, 'update')
        .mockResolvedValue(brandObject as Brand);

      const result = await brandController.update(id, updateData);
      expect(result).toBe(brandObject);
      expect(updateSpy).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('delete', () => {
    it('should delete the brand', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440100';
      const deleteSpy = jest
        .spyOn(brandService, 'delete')
        .mockResolvedValue(undefined);

      const result = await brandController.delete(id);
      expect(result).toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith(id);
    });
  });
});
