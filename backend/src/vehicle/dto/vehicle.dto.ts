import { IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  name: string;
  vehicleBrandId: string;
  vehicleModelId: string;
  vehicleStatusId: string;
}
