import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getBeev(): string {
    return this.appService.getBeev();
  }

  @Get('/version')
  @CacheTTL(1000 * 10)
  async getVersion() {
    return this.appService.getVersion();
  }
}
