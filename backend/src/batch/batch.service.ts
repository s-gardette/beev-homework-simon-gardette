import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '@/brand/brand.entities';
import { Model, TypeEnum } from '@/model/model.entities';
import {
  Vehicle,
  VehicleStatus,
  VehicleStatusEnum,
} from '@/vehicle/vehicle.entities';

type ImportSummary = {
  brandsCreated: number;
  modelsCreated: number;
  vehiclesCreated: number;
  vehiclesSkipped: number;
};

// It's all GPT work
@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(Model)
    private readonly modelRepo: Repository<Model>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleStatus)
    private readonly vehicleStatusRepo: Repository<VehicleStatus>,
  ) {}

  /**
   * Minimal CSV parser that handles simple CSV without escaped commas.
   * Expects header row. Returns array of records as string[] keyed by headers.
   */
  private parseCsv(csv: string): Record<string, string>[] {
    const lines = csv
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return [];
    const rawHeaders = lines[0].split(',').map((h) => h.trim());
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length > rawHeaders.length) {
        const first = cols.slice(0, rawHeaders.length - 1);
        const rest = cols.slice(rawHeaders.length - 1).join(',');
        cols.length = 0;
        cols.push(...first, rest);
      }
      const obj: Record<string, string> = {};
      for (let j = 0; j < rawHeaders.length; j++) {
        obj[rawHeaders[j]] = (cols[j] ?? '').trim();
      }
      rows.push(obj);
    }
    return rows;
  }

  async importFromCsv(csv: string): Promise<ImportSummary> {
    const records = this.parseCsv(csv);
    let brandsCreated = 0;
    let modelsCreated = 0;
    let vehiclesCreated = 0;
    let vehiclesSkipped = 0;

    for (const r of records) {
      try {
        const externalId = r['ID'] || r['id'] || r['ExternalId'] || '';
        const brandName = r['Brand'] || r['brand'] || '';
        const modelName = r['Model'] || r['model'] || '';
        const batteryCapacityStr =
          r['Battery capacity (kWh)'] || r['Battery capacity'] || '0';
        const currentChargeStr =
          r['Current charge level (%)'] || r['Current charge level'] || '0';
        const statusStr = (r['Status'] || 'available').toLowerCase();
        const avgConsumptionStr =
          r['Average energy consumption (kWh/100km or L/100km)'] ||
          r['Average energy consumption'] ||
          '0';
        const typeStr = (r['Type'] || 'BEV').toUpperCase();
        const emissionStr =
          r['Emission_gco2_km'] || r['Emission_gco2_km'] || '0';

        if (!brandName || !modelName) {
          console.warn(
            `Skipping record with missing brand or model: ${JSON.stringify(r)}`,
          );
          vehiclesSkipped++;
          continue;
        }

        // find or create brand
        let brand = await this.brandRepo.findOneBy({ name: brandName });
        if (!brand) {
          brand = this.brandRepo.create({ name: brandName });
          brand = await this.brandRepo.save(brand);
          brandsCreated++;
        }

        // find or create model (by name + brand)
        let model = await this.modelRepo
          .createQueryBuilder('m')
          .leftJoinAndSelect('m.Brand', 'brand')
          .where('m.name = :name', { name: modelName })
          .andWhere('brand.id = :brandId', { brandId: brand.id })
          .getOne();

        const batteryCapacity = parseInt(batteryCapacityStr || '0', 10) || 0;
        const avgConsumptionRaw = parseFloat(avgConsumptionStr || '0') || 0;
        const emission = parseFloat(emissionStr || '0') || 0;

        const type = typeStr === 'ICE' ? TypeEnum.ICE : TypeEnum.BEV;

        const averageConsumption =
          type === TypeEnum.BEV ? avgConsumptionRaw * 10 : avgConsumptionRaw;

        if (!model) {
          model = this.modelRepo.create({
            name: modelName,
            batteryCapacity,
            averageConsumption,
            emissionGCO2: emission,
            Type: type,
            Brand: brand,
          } as Partial<Model>);
          model = await this.modelRepo.save(model);
          modelsCreated++;
        }

        // avoid creating duplicate vehicle for same externalId
        let vehicle: Vehicle | null = null;
        if (externalId) {
          vehicle = await this.vehicleRepo.findOneBy({ externalId });
        }

        if (vehicle) {
          console.warn(
            `Skipping duplicate vehicle with externalId: ${externalId}`,
          );
          vehiclesSkipped++;
          continue;
        }

        const vehicleName = `${brand.name} ${model.name}`;
        const vehicleEntity = this.vehicleRepo.create({
          externalId: externalId || null,
          name: vehicleName,
          brand: brand,
          model: model,
        } as Partial<Vehicle>);

        const savedVehicle = await this.vehicleRepo.save(vehicleEntity);

        const currentChargeLevel = parseFloat(currentChargeStr || '0') || 0;
        const status = statusStr as unknown as VehicleStatusEnum;

        const statusEntity = this.vehicleStatusRepo.create({
          currentChargeLevel,
          status,
          vehicle: savedVehicle,
        } as Partial<VehicleStatus>);
        await this.vehicleStatusRepo.save(statusEntity);

        vehiclesCreated++;
      } catch (error) {
        console.error(`Error processing record: ${JSON.stringify(r)}`, error);
        vehiclesSkipped++;
      }
    }

    return { brandsCreated, modelsCreated, vehiclesCreated, vehiclesSkipped };
  }
}
