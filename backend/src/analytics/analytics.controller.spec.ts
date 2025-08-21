import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  BrandAnalyticsView,
  ModelEfficiencyView,
  EmissionsByDriveTypeView,
  FleetCompositionView,
  FleetOperationalView,
} from './analytics.entities';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockService = {
    getBrandAnalytics: jest.fn(),
    getFleetEfficiency: jest.fn(),
    getEmissionsByDriveType: jest.fn(),
    getFleetComposition: jest.fn(),
    getFleetOperational: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: mockService }],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  afterEach(() => jest.resetAllMocks());

  it('getBrandAnalytics returns results from service', async () => {
    const data: BrandAnalyticsView[] = [{ brand: 'A' } as any];
    mockService.getBrandAnalytics.mockResolvedValue(data);
    const res = await controller.getBrandAnalytics();
    expect(res).toBe(data);
    expect(mockService.getBrandAnalytics).toHaveBeenCalled();
  });

  it('getFleetEfficiency returns results from service', async () => {
    const data: ModelEfficiencyView[] = [{ model: 'M' } as any];
    mockService.getFleetEfficiency.mockResolvedValue(data);
    const res = await controller.getFleetEfficiency();
    expect(res).toBe(data);
    expect(mockService.getFleetEfficiency).toHaveBeenCalled();
  });

  it('getFleetEmissions returns results from service', async () => {
    const data: EmissionsByDriveTypeView[] = [{ driveType: 'BEV' } as any];
    mockService.getEmissionsByDriveType.mockResolvedValue(data);
    const res = await controller.getFleetEmissions();
    expect(res).toBe(data);
    expect(mockService.getEmissionsByDriveType).toHaveBeenCalled();
  });

  it('getFleetComposition returns results from service', async () => {
    const data: FleetCompositionView[] = [{ composition: 1 } as any];
    mockService.getFleetComposition.mockResolvedValue(data);
    const res = await controller.getFleetComposition();
    expect(res).toBe(data);
    expect(mockService.getFleetComposition).toHaveBeenCalled();
  });

  it('getFleetOperational returns results from service', async () => {
    const data: FleetOperationalView[] = [{ operational: true } as any];
    mockService.getFleetOperational.mockResolvedValue(data);
    const res = await controller.getFleetOperational();
    expect(res).toBe(data);
    expect(mockService.getFleetOperational).toHaveBeenCalled();
  });
});
