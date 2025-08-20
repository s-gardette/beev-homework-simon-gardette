import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Vehicle name',
    maxLength: 500,
  })
  name: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Vehicle brand id (uuid)',
  })
  vehicleBrandId: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Vehicle model id (uuid)',
  })
  vehicleModelId: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Vehicle status id (int)',
  })
  vehicleStatusId: string;
}

export class UpdateVehicleDto {
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Vehicle name',
    maxLength: 500,
  })
  name?: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Vehicle brand id (uuid)',
  })
  vehicleBrandId?: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Vehicle model id (uuid)',
  })
  vehicleModelId?: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Vehicle status id (int)',
  })
  vehicleStatusId?: string;
}
