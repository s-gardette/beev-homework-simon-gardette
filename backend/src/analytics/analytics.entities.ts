import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { Vehicle, VehicleStatus } from '@/vehicle/vehicle.entities';
import { Model } from '@/model/model.entities';
import { Brand } from '@/brand/brand.entities';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('brand.id', 'brandId')
      .addSelect('brand.name', 'brandName')
      // average current charge level from vehicle status (e.g. percent)
      .addSelect('AVG(vehicleStatus.currentChargeLevel)', 'averageCharge')
      // average of model averageConsumption (Wh/km)
      .addSelect('AVG(model.averageConsumption)', 'averageConsumption')
      // average battery capacity (kWh)
      .addSelect('AVG(model.batteryCapacity)', 'averageBatteryCapacity')
      // number of vehicles considered
      .addSelect('COUNT(vehicle.id)', 'vehiclesCount')
      .from(Vehicle, 'vehicle')
      // left join vehicle status (one-to-one)
      .leftJoin(
        VehicleStatus,
        'vehicleStatus',
        'vehicleStatus.vehicle = vehicle.id',
      )
      // left join model referenced by vehicle
      .leftJoin(Model, 'model', 'vehicle.model = model.id')
      // left join brand referenced by vehicle (grouping key)
      .leftJoin(Brand, 'brand', 'vehicle.brand = brand.id')
      .groupBy('brand.id')
      .addGroupBy('brand.name'),
})
export class BrandAnalyticsView {
  @ViewColumn()
  brandId: string;

  @ViewColumn()
  brandName: string;

  @ViewColumn()
  averageCharge: number;

  @ViewColumn()
  averageConsumption: number;

  @ViewColumn()
  averageBatteryCapacity: number;

  @ViewColumn()
  vehiclesCount: number;
}

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('model.id', 'modelId')
      .addSelect('model.name', 'modelName')
      .addSelect('AVG(model.averageConsumption)', 'avgConsumption')
      .addSelect('AVG(model.batteryCapacity)', 'avgBatteryCapacity')
      .addSelect('COUNT(vehicle.id)', 'vehiclesCount')
      .from(Vehicle, 'vehicle')
      .leftJoin(Model, 'model', 'vehicle.model = model.id')
      .groupBy('model.id')
      .addGroupBy('model.name'),
})
export class ModelEfficiencyView {
  @ViewColumn()
  modelId: string;

  @ViewColumn()
  modelName: string;

  @ViewColumn()
  avgConsumption: number;

  @ViewColumn()
  avgBatteryCapacity: number;

  @ViewColumn()
  vehiclesCount: number;
}

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('model.Type', 'type')
      .addSelect('AVG(model.emissionGCO2)', 'avgEmission')
      .addSelect('COUNT(vehicle.id)', 'vehiclesCount')
      .from(Vehicle, 'vehicle')
      .leftJoin(Model, 'model', 'vehicle.model = model.id')
      .groupBy('model.Type'),
})
export class EmissionsByDriveTypeView {
  @ViewColumn()
  type: string;

  @ViewColumn()
  avgEmission: number;

  @ViewColumn()
  vehiclesCount: number;
}

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('model.Type', 'type')
      .addSelect('COUNT(vehicle.id)', 'count')
      .addSelect(
        '(COUNT(vehicle.id) * 100.0) / (SELECT COUNT(*) FROM vehicle)',
        'percentage',
      )
      .from(Vehicle, 'vehicle')
      .leftJoin(Model, 'model', 'vehicle.model = model.id')
      .groupBy('model.Type'),
})
export class FleetCompositionView {
  @ViewColumn()
  type: string;

  @ViewColumn()
  count: number;

  @ViewColumn()
  percentage: number;
}

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(vehicle.id)', 'totalVehicles')
      .addSelect(
        "SUM(CASE WHEN vehicleStatus.status = 'available' THEN 1 ELSE 0 END)",
        'availableCount',
      )
      .addSelect(
        "SUM(CASE WHEN vehicleStatus.status = 'charging' THEN 1 ELSE 0 END)",
        'chargingCount',
      )
      .addSelect(
        "SUM(CASE WHEN vehicleStatus.status = 'in_use' THEN 1 ELSE 0 END)",
        'inUseCount',
      )
      .addSelect(
        "(SUM(CASE WHEN vehicleStatus.status = 'available' THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(vehicle.id), 0)",
        'availabilityRate',
      )
      .from(Vehicle, 'vehicle')
      .leftJoin(
        VehicleStatus,
        'vehicleStatus',
        'vehicleStatus.vehicle = vehicle.id',
      ),
})
export class FleetOperationalView {
  @ViewColumn()
  totalVehicles: number;

  @ViewColumn()
  availableCount: number;

  @ViewColumn()
  chargingCount: number;

  @ViewColumn()
  inUseCount: number;

  @ViewColumn()
  availabilityRate: number;
}
