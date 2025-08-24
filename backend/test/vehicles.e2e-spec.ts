import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateVehicleDto, UpdateVehicleDto } from '../src/vehicle/dto/vehicle.dto';
import { VehicleStatusEnum } from '../src/vehicle/vehicle.entities';

describe('VehicleController (e2e)', () => {
  let app: INestApplication;
  let createdVehicleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vehicles (POST)', async () => {
    const vehicle: CreateVehicleDto = {
      name: 'Test Vehicle',
      brandId: 'bf643f66-b042-4797-9d79-a5d2284bede3',
      modelId: 'c1a2b3d4-e5f6-7890-abcd-ef0123456789',
      vehicleStatus: {
        status: VehicleStatusEnum.Available,
        currentChargeLevel: 100,
      },
    };

    const response = await request(app.getHttpServer())
      .post('/vehicles')
      .send(vehicle)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdVehicleId = response.body.id;
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
      .get(`/vehicles/${createdVehicleId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(createdVehicleId);
      });
  });

  it('/vehicles/:id (GET) - Not Found', () => {
    return request(app.getHttpServer())
      .get('/vehicles/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('/vehicles/:id (PUT)', () => {
    const updatedVehicle: UpdateVehicleDto = {
      name: 'Updated Test Vehicle',
    };

    return request(app.getHttpServer())
      .put(`/vehicles/${createdVehicleId}`)
      .send(updatedVehicle)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Updated Test Vehicle');
      });
  });

  it('/vehicles/:id (PUT) - Not Found', () => {
    const updatedVehicle: UpdateVehicleDto = {
      name: 'Updated Test Vehicle',
    };

    return request(app.getHttpServer())
      .put('/vehicles/00000000-0000-0000-0000-000000000000')
      .send(updatedVehicle)
      .expect(404);
  });

  it('/vehicles/:id/status (PUT)', () => {
    const updatedStatus = {
      status: VehicleStatusEnum.Charging,
    };

    return request(app.getHttpServer())
      .put(`/vehicles/${createdVehicleId}/status`)
      .send(updatedStatus)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(VehicleStatusEnum.Charging);
      });
  });

  it('/vehicles/:id/status (PUT) - Not Found', () => {
    const updatedStatus = {
      status: VehicleStatusEnum.Charging,
    };

    return request(app.getHttpServer())
      .put('/vehicles/00000000-0000-0000-0000-000000000000/status')
      .send(updatedStatus)
      .expect(404);
  });

  it('/vehicles/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/vehicles/${createdVehicleId}`)
      .expect(204);
  });

  it('/vehicles/:id (DELETE) - Not Found', () => {
    return request(app.getHttpServer())
      .delete('/vehicles/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});