import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleStatus, VehicleStatusEnum } from './vehicle.entities';
import { CreateVehicleDto } from './dto/vehicle.dto';

describe('VehicleService (unit)', () => {
  let service: VehicleService;
  let mockVehicleRepo: any;
  let mockStatusRepo: any;

  beforeEach(async () => {
    mockVehicleRepo = {
      create: jest.fn((v) => v),
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      preload: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    mockStatusRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        {
          provide: getRepositoryToken(VehicleStatus),
          useValue: mockStatusRepo,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  afterEach(() => jest.resetAllMocks());

  it('updateStatus throws NotFoundException when vehicle not found', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(null);
    await expect(
      service.updateStatus('nonexistent', {} as Partial<VehicleStatus>),
    ).rejects.toThrow(NotFoundException);
  });

  it('updateStatus updates existing status when found', async () => {
    const vehicle: Partial<Vehicle> = {
      id: 'v2',
      vehicleStatus: { id: 7 } as any,
    };
    const existingStatus = {
      id: 7,
      status: VehicleStatusEnum.Available,
      currentChargeLevel: 80,
    } as any;

    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockStatusRepo.save.mockImplementation((s) => Promise.resolve({ ...existingStatus, ...s }));

    const toUpdate: Partial<VehicleStatus> = { currentChargeLevel: 50 };
    const res = await service.updateStatus('v2', toUpdate);

    expect(mockStatusRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('currentChargeLevel', 50);
  });

  it('updateStatus creates a new status when none exists', async () => {
    const vehicle: Partial<Vehicle> = { id: 'v3', vehicleStatus: undefined };
    const created = {
      id: 99,
      status: VehicleStatusEnum.InUse,
      currentChargeLevel: 20,
    } as VehicleStatus;

    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockStatusRepo.create.mockImplementation((s) => ({ ...s }));
    mockStatusRepo.save.mockResolvedValue(created);

    const res = await service.updateStatus('v3', {
      status: VehicleStatusEnum.InUse,
      currentChargeLevel: 20,
    } as Partial<VehicleStatus>);

    expect(mockStatusRepo.create).toHaveBeenCalled();
    expect(mockStatusRepo.save).toHaveBeenCalled();
    expect(res).toEqual(created);
  });

  it('update throws NotFoundException when vehicle not found', async () => {
    mockVehicleRepo.preload.mockResolvedValue(null);
    await expect(service.update('nope', { name: 'x' } as Partial<Vehicle>)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('create with inline vehicleStatus creates and returns full vehicle', async () => {
    const partial = {
      name: 'v-create',
      vehicleStatus: { currentChargeLevel: 10 },
    } as CreateVehicleDto;
    const savedVehicle = { id: 'new-id', ...partial } as any;

    mockVehicleRepo.create.mockImplementation((r) => r);
    mockVehicleRepo.save.mockResolvedValue(savedVehicle);

    const res = await service.create(partial);
    expect(mockVehicleRepo.save).toHaveBeenCalled();
    expect(res).toEqual(savedVehicle);
  });

  it('findAll applies brandId filter to query builder', async () => {
    const qb = mockVehicleRepo.createQueryBuilder();
    await service.findAll('BRAND-123');
    expect(qb.andWhere).toHaveBeenCalledWith('brand.id = :brandId', {
      brandId: 'BRAND-123',
    });
  });

  it('delete throws NotFoundException when vehicle not found', async () => {
    mockVehicleRepo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.delete('nonexistent')).rejects.toThrow(NotFoundException);
  });
});