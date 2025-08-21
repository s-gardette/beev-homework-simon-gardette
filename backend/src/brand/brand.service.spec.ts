import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrandService } from './brand.service';
import { Brand } from './brand.entities';

describe('BrandService (unit)', () => {
  let service: BrandService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      create: jest.fn((b) => b),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: getRepositoryToken(Brand), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
  });

  afterEach(() => jest.resetAllMocks());

  it('findAll returns array from repo', async () => {
    mockRepo.find.mockResolvedValue([{ id: 'b1', name: 'B' }]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: 'b1', name: 'B' }]);
  });

  it('findOne returns null when not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    const res = await service.findOne('nope');
    expect(res).toBeNull();
  });

  it('create uses repo.create and repo.save', async () => {
    const partial = { name: 'NewBrand' } as Partial<Brand>;
    const saved = { id: 'nb', name: 'NewBrand' } as Brand;
    mockRepo.create.mockImplementation((r) => r);
    mockRepo.save.mockResolvedValue(saved);

    const res = await service.create(partial);
    expect(mockRepo.create).toHaveBeenCalledWith(partial);
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res).toEqual(saved);
  });

  it('update returns null when brand not found after update', async () => {
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOneBy.mockResolvedValue(null);
    const res = await service.update('id-x', { name: 'x' } as any);
    expect(mockRepo.update).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('delete calls repo.delete', async () => {
    await service.delete('del');
    expect(mockRepo.delete).toHaveBeenCalledWith('del');
  });
});
