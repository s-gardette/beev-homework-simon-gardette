import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { App } from 'supertest/types';
import { vehicleObject } from '@/vehicle/vehicle.controller.spec';

describe('VehicleController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('/vehicles (POST)', () => {
    return request(app.getHttpServer())
      .post('/vehicles')
      .send({
        brand: vehicleObject?.brand?.id,
        model: vehicleObject?.model?.id,
        externalId: vehicleObject.externalId,
        vehicleStatus: vehicleObject.vehicleStatus,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('/vehicles (GET)', () => {
    return request(app.getHttpServer())
      .get('/vehicles')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('/vehicles/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/vehicles/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe('1');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
