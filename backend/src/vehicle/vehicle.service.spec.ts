import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleStatus, VehicleStatusEnum } from './vehicle.entities';
// The test uses untyped jest mocks which trip several `@typescript-eslint/no-unsafe-*` rules.
// Disable those rules for this file only. Prefer strongly-typed mocks as a long-term fix.

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
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    mockStatusRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
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

  it('updateStatus returns null when vehicle not found', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(null);
    const res = await service.updateStatus(
      'nonexistent',
      {} as Partial<VehicleStatus>,
    );
    expect(res).toBeNull();
  });

  it('updateStatus returns null when vehicle has status id but repo findOneBy returns null', async () => {
    const vehicle: Partial<Vehicle> = {
      id: 'v1',
      vehicleStatus: { id: 42 } as any,
    };
    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockStatusRepo.findOneBy.mockResolvedValue(null);

    const res = await service.updateStatus('v1', {
      currentChargeLevel: 10,
    } as Partial<VehicleStatus>);
    expect(mockStatusRepo.findOneBy).toHaveBeenCalledWith({ id: 42 });
    expect(res).toBeNull();
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
    mockStatusRepo.findOneBy.mockResolvedValue(existingStatus);
    mockStatusRepo.save.mockImplementation((s) => Promise.resolve({ ...s }));

    const toUpdate: Partial<VehicleStatus> = { currentChargeLevel: 50 };
    const res = await service.updateStatus('v2', toUpdate);

    expect(mockStatusRepo.findOneBy).toHaveBeenCalledWith({ id: 7 });
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

  it('update returns null when vehicle not found', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(null);
    const res = await service.update('nope', { name: 'x' } as Partial<Vehicle>);
    expect(res).toBeNull();
  });

  it('update throws NotFoundException when vehicleStatusId does not exist', async () => {
    const vehicle: Partial<Vehicle> = { id: 'v4', vehicleStatus: undefined };
    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockStatusRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.update('v4', { vehicleStatusId: 123 } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('update clears vehicleStatus when vehicleStatusId is null', async () => {
    const vehicle: Partial<Vehicle> = {
      id: 'v5',
      vehicleStatus: { id: 5 } as any,
    };
    const savedVehicle = {
      ...(vehicle as any),
      vehicleStatus: null,
    } as Vehicle;

    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockVehicleRepo.save.mockResolvedValue(savedVehicle);

    const res = await service.update('v5', { vehicleStatusId: null } as any);
    expect(mockVehicleRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('vehicleStatus', null);
  });

  it('create with inline vehicleStatus creates and returns full vehicle', async () => {
    const partial = {
      name: 'v-create',
      vehicleStatus: { currentChargeLevel: 10 },
    } as Partial<Vehicle>;
    const savedVehicle = { id: 'new-id', ...partial } as any;
    const savedStatus = {
      id: 55,
      currentChargeLevel: 10,
      status: VehicleStatusEnum.Available,
    } as any;
    const fullVehicle = { ...savedVehicle, vehicleStatus: savedStatus };

    mockVehicleRepo.create.mockImplementation((r) => r);
    mockVehicleRepo.save.mockResolvedValue(savedVehicle);
    mockStatusRepo.create.mockImplementation((s) => ({ ...s }));
    mockStatusRepo.save.mockResolvedValue(savedStatus);
    mockVehicleRepo.findOne.mockResolvedValue(fullVehicle);

    const res = await service.create(partial);
    expect(mockVehicleRepo.save).toHaveBeenCalled();
    expect(mockStatusRepo.save).toHaveBeenCalled();
    expect(res).toEqual(fullVehicle);
  });

  it('findAll applies brandId filter to query builder', async () => {
    // ensure createQueryBuilder returns a spyable object
    const qb = mockVehicleRepo.createQueryBuilder();
    // call findAll with a brandId
    await service.findAll('BRAND-123');
    expect(qb.andWhere).toHaveBeenCalledWith('brand.id = :brandId', {
      brandId: 'BRAND-123',
    });
  });

  it('create without inline vehicleStatus does not create status', async () => {
    const partial = { name: 'v-create-no-status' } as Partial<Vehicle>;
    const savedVehicle = { id: 'new-id-no-status', ...partial } as any;
    const fullVehicle = { ...savedVehicle, vehicleStatus: undefined };

    mockVehicleRepo.create.mockImplementation((r) => r);
    mockVehicleRepo.save.mockResolvedValue(savedVehicle);
    mockVehicleRepo.findOne.mockResolvedValue(fullVehicle);

    const res = await service.create(partial);
    expect(mockStatusRepo.save).not.toHaveBeenCalled();
    expect(res).toEqual(fullVehicle);
  });

  it('update attaches existing vehicleStatus when vehicleStatusId exists and saves', async () => {
    const vehicle: Partial<Vehicle> = {
      id: 'v-update',
      vehicleStatus: undefined,
      name: 'old',
    };
    const status = {
      id: 200,
      status: VehicleStatusEnum.Available,
      currentChargeLevel: 90,
    } as any;
    const savedVehicle = {
      ...vehicle,
      vehicleStatus: status,
      name: 'updated',
    } as any;

    mockVehicleRepo.findOne.mockResolvedValue(vehicle);
    mockStatusRepo.findOneBy.mockResolvedValue(status);
    mockVehicleRepo.save.mockResolvedValue(savedVehicle);

    const res = await service.update('v-update', {
      vehicleStatusId: 200,
      name: 'updated',
    } as any);
    expect(mockStatusRepo.findOneBy).toHaveBeenCalledWith({ id: 200 });
    expect(mockVehicleRepo.save).toHaveBeenCalled();
    expect(res).toEqual(savedVehicle);
  });
});
