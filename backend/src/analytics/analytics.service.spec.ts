import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import {
  BrandAnalyticsView,
  ModelEfficiencyView,
  EmissionsByDriveTypeView,
  FleetCompositionView,
  FleetOperationalView,
} from './analytics.entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AnalyticsService (unit)', () => {
  let service: AnalyticsService;
  let brandRepo: any;
  let modelRepo: any;
  let emissionsRepo: any;
  let compositionRepo: any;
  let operationalRepo: any;

  beforeEach(async () => {
    brandRepo = { find: jest.fn().mockResolvedValue([]) };
    modelRepo = { find: jest.fn().mockResolvedValue([]) };
    emissionsRepo = { find: jest.fn().mockResolvedValue([]) };
    compositionRepo = { find: jest.fn().mockResolvedValue([]) };
    operationalRepo = { find: jest.fn().mockResolvedValue([]) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(BrandAnalyticsView),
          useValue: brandRepo,
        },
        {
          provide: getRepositoryToken(ModelEfficiencyView),
          useValue: modelRepo,
        },
        {
          provide: getRepositoryToken(EmissionsByDriveTypeView),
          useValue: emissionsRepo,
        },
        {
          provide: getRepositoryToken(FleetCompositionView),
          useValue: compositionRepo,
        },
        {
          provide: getRepositoryToken(FleetOperationalView),
          useValue: operationalRepo,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => jest.resetAllMocks());

  it('getBrandAnalytics returns results from repo', async () => {
    brandRepo.find.mockResolvedValue([{ brand: 'X' }]);
    const res = await service.getBrandAnalytics();
    expect(res).toEqual([{ brand: 'X' }]);
  });

  it('getFleetEfficiency returns results from repo', async () => {
    modelRepo.find.mockResolvedValue([{ model: 'Y' }]);
    const res = await service.getFleetEfficiency();
    expect(res).toEqual([{ model: 'Y' }]);
  });

  it('getEmissionsByDriveType returns results from repo', async () => {
    emissionsRepo.find.mockResolvedValue([{ drive: 'e' }]);
    const res = await service.getEmissionsByDriveType();
    expect(res).toEqual([{ drive: 'e' }]);
  });

  it('getFleetComposition returns results from repo', async () => {
    compositionRepo.find.mockResolvedValue([{ comp: 1 }]);
    const res = await service.getFleetComposition();
    expect(res).toEqual([{ comp: 1 }]);
  });

  it('getFleetOperational returns results from repo', async () => {
    operationalRepo.find.mockResolvedValue([{ op: true }]);
    const res = await service.getFleetOperational();
    expect(res).toEqual({ op: true });
  });
});
