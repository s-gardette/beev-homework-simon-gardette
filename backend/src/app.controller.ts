import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BatchService } from './batch/batch.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly batchService: BatchService,
  ) {}

  @Get()
  getBeev(): string {
    return this.appService.getBeev();
  }

  @Get('/version')
  @CacheTTL(1000 * 10)
  async getVersion() {
    return this.appService.getVersion();
  }

  @Post('/seed')
  async seedDb() {
    try {
      const csvPath = join(process.cwd(), '../', 'data', 'cars.csv');
      const csv = readFileSync(csvPath, 'utf-8');
      const result = await this.batchService.importFromCsv(csv);
      return { result };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error('Seed failed', e);
      throw new HttpException(
        { message: 'Seed failed', error: errorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
