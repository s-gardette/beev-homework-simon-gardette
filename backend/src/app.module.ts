import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionEntity } from './version.entity';
import { Keyv, createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { CacheModule } from '@nestjs/cache-manager';
import { VehicleModule } from './vehicle/vehicle.module';
import { ModelModule } from './model/model.module';
import { BrandModule } from './brand/brand.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BatchModule } from './batch/batch.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([VersionEntity]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ lruSize: 5000 }),
            }),
            createKeyv('redis://localhost:6379'),
          ],
        };
      },
    }),
    BrandModule,
    ModelModule,
    VehicleModule,
    AnalyticsModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
