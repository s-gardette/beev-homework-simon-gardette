import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchService } from './batch/batch.service';
import { VersionEntity } from './version.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(VersionEntity),
          useValue: mockRepo,
        },
        {
          provide: BatchService,
          useValue: { importFromCsv: jest.fn() },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Beev"', () => {
      expect(appController.getBeev()).toBe('Beev');
    });
  });
});
