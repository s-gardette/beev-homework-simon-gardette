import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Vehicle, VehicleStatus, VehicleStatusEnum } from './vehicle.entities';
import { CreateVehicleDto, UpdateVehicleDto, UpdateVehicleStatusDto } from './dto/vehicle.dto';

export const vehicleObject: DeepPartial<Vehicle> = {
  name: 'Test Vehicle',
  id: '550e8400-e29b-41d4-a716-446655440000',
  externalId: '550e8400-a55b-41d4-a716-446655440012',
  brand: {
    id: 'bf643f66-b042-4797-9d79-a5d2284bede3',
    name: 'Test Brand',
  },
  model: {
    id: 'c1a2b3d4-e5f6-7890-abcd-ef0123456789',
    name: 'Test Model',
  },
  vehicleStatus: {
    id: 1,
    status: VehicleStatusEnum.Available,
    currentChargeLevel: 100,
  },
};

describe('VehicleController', () => {
  let vehicleController: VehicleController;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const mockVehicleRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };
    const mockStatusRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        VehicleService,
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        {
          provide: getRepositoryToken(VehicleStatus),
          useValue: mockStatusRepo,
        },
      ],
    }).compile();

    vehicleController = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      const result = ['test'];
      jest
        .spyOn(vehicleService, 'findAll')
        .mockImplementation(() => Promise.resolve(result as any));

      expect(await vehicleController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const vehicle = vehicleObject;

      const findOneSpy = jest
        .spyOn(vehicleService, 'findOne')
        .mockResolvedValue(vehicle as Vehicle);

      const result = await vehicleController.findOne(id);
      expect(result).toBe(vehicle);
      expect(findOneSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const vehicleData: CreateVehicleDto = {
        name: 'New Vehicle',
        brandId: vehicleObject.brand!.id!,
        modelId: vehicleObject.model!.id!,
        vehicleStatus: vehicleObject.vehicleStatus,
      };

      jest
        .spyOn(vehicleService, 'create')
        .mockResolvedValue(vehicleObject as Vehicle);

      const result = await vehicleController.create(vehicleData);
      expect(result).toHaveProperty('id');
      expect(result.brand.id).toBe('bf643f66-b042-4797-9d79-a5d2284bede3');
      expect(result.model.id).toBe('c1a2b3d4-e5f6-7890-abcd-ef0123456789');
    });
  });

  describe('update', () => {
    it('should update and return the vehicle', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const updateData: UpdateVehicleDto = { name: 'Updated Vehicle' };

      const updateSpy = jest
        .spyOn(vehicleService, 'update')
        .mockResolvedValue(vehicleObject as Vehicle);

      const result = await vehicleController.update(id, updateData);
      expect(result).toBe(vehicleObject);
      expect(updateSpy).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe('delete', () => {
    it('should delete the vehicle', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      const deleteSpy = jest
        .spyOn(vehicleService, 'delete')
        .mockResolvedValue(undefined);

      const result = await vehicleController.delete(id);
      expect(result).toBeUndefined();
      expect(deleteSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('updateStatus', () => {
    it("should update or create a vehicle's status and return it", async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const statusData: UpdateVehicleStatusDto = {
        status: VehicleStatusEnum.InUse,
        currentChargeLevel: 50,
      };

      const statusObj = (vehicleObject.vehicleStatus || {
        id: 1,
        status: VehicleStatusEnum.InUse,
        currentChargeLevel: 50,
      }) as VehicleStatus;

      const statusSpy = jest
        .spyOn(vehicleService, 'updateStatus')
        .mockResolvedValue(statusObj);

      const result = await vehicleController.updateStatus(id, statusData);
      expect(result).toBe(statusObj);
      expect(statusSpy).toHaveBeenCalledWith(id, statusData);
    });
  });
});
