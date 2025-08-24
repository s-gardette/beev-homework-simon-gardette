import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BatchService } from './batch.service';
import { Brand } from '@/brand/brand.entities';
import { Model } from '@/model/model.entities';
import { Vehicle, VehicleStatus } from '@/vehicle/vehicle.entities';

describe('BatchService', () => {
  let service: BatchService;

  let brandRepo: any;
  let modelRepo: any;
  let vehicleRepo: any;
  let vehicleStatusRepo: any;

  beforeEach(async () => {
    brandRepo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const qb: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    modelRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
      create: jest.fn(),
      save: jest.fn(),
    };

    vehicleRepo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    vehicleStatusRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchService,
        { provide: getRepositoryToken(Brand), useValue: brandRepo },
        { provide: getRepositoryToken(Model), useValue: modelRepo },
        { provide: getRepositoryToken(Vehicle), useValue: vehicleRepo },
        {
          provide: getRepositoryToken(VehicleStatus),
          useValue: vehicleStatusRepo,
        },
      ],
    }).compile();

    service = module.get<BatchService>(BatchService);
  });

  afterEach(() => jest.resetAllMocks());

  it('importFromCsv creates brand, model, vehicle and vehicle status', async () => {
    // set up mocks to simulate "not found" for brand/model/vehicle
    brandRepo.findOneBy.mockResolvedValue(null);
    brandRepo.create.mockImplementation((b: any) => b);
    brandRepo.save.mockImplementation((b: any) => ({ id: 1, ...b }));

    // model qb returns no record
    const qb: any = modelRepo.createQueryBuilder();
    qb.getOne.mockResolvedValue(null);
    modelRepo.create.mockImplementation((m: any) => m);
    modelRepo.save.mockImplementation((m: any) => ({ id: 2, ...m }));

    vehicleRepo.findOneBy.mockResolvedValue(null);
    vehicleRepo.create.mockImplementation((v: any) => v);
    vehicleRepo.save.mockImplementation((v: any) => ({ id: 3, ...v }));

    vehicleStatusRepo.create.mockImplementation((s: any) => s);
    vehicleStatusRepo.save.mockResolvedValue({ id: 4 });

    const csv = `ID,Brand,Model,Battery capacity (kWh),Current charge level (%),Status,Average energy consumption (kWh/100km or L/100km),Type,Emission_gco2_km
ext-1,Acme,ModelX,50,80,available,15,BEV,0`;

    const res = await service.importFromCsv(csv);

    expect(res).toEqual({
      brandsCreated: 1,
      modelsCreated: 1,
      vehiclesCreated: 1,
      vehiclesSkipped: 0,
    });

    expect(brandRepo.save).toHaveBeenCalled();
    expect(modelRepo.save).toHaveBeenCalled();
    expect(vehicleRepo.save).toHaveBeenCalled();
    expect(vehicleStatusRepo.save).toHaveBeenCalled();
  });

  it('importFromCsv skips duplicate vehicle with same externalId', async () => {
    // brand and model already exist
    brandRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Acme' });
    const qb: any = modelRepo.createQueryBuilder();
    qb.getOne.mockResolvedValue({ id: 2, name: 'ModelX' });

    // vehicle already exists -> should skip
    vehicleRepo.findOneBy.mockResolvedValue({ id: 3, externalId: 'ext-1' });

    const csv = `ID,Brand,Model
ext-1,Acme,ModelX`;

    const res = await service.importFromCsv(csv);

    expect(res).toEqual({
      brandsCreated: 0,
      modelsCreated: 0,
      vehiclesCreated: 0,
      vehiclesSkipped: 1,
    });
  });
});
