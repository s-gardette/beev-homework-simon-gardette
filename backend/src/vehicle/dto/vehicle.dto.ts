import {
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatusEnum } from '../vehicle.entities';

export class CreateVehicleStatusDto {
  @ApiProperty({
    description: 'Current charge level (0-100)',
    example: 75,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  currentChargeLevel?: number;

  @ApiProperty({
    description: 'Vehicle status enum',
    example: VehicleStatusEnum.Available,
    required: false,
    enum: Object.values(VehicleStatusEnum),
  })
  @IsEnum(VehicleStatusEnum)
  @IsOptional()
  status?: VehicleStatusEnum;
}

export class UpdateVehicleStatusDto {
  @ApiProperty({
    description: 'Current charge level (0-100)',
    example: 75,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  currentChargeLevel?: number;

  @ApiProperty({
    description: 'Vehicle status enum',
    example: VehicleStatusEnum.Available,
    required: false,
    enum: Object.values(VehicleStatusEnum),
  })
  @IsEnum(VehicleStatusEnum)
  @IsOptional()
  status?: VehicleStatusEnum;
}

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Unique external id (nullable uuid)',
    example: null,
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  externalId?: string | null;

  @ApiProperty({
    description: 'Vehicle name',
    example: 'My EV 2024',
    maxLength: 200,
    required: true,
  })
  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Vehicle brand id (uuid)',
    example: 'bf643f66-b042-4797-9d79-a5d2284bede3',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    description: 'Vehicle model id (uuid)',
    example: 'c1a2b3d4-e5f6-7890-abcd-ef0123456789',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  modelId: string;

  @ApiProperty({
    description:
      'Inline initial vehicle status object (creates a new VehicleStatus)',
    required: false,
    type: () => CreateVehicleStatusDto,
    example: { currentChargeLevel: 80, status: VehicleStatusEnum.Available },
  })
  @IsOptional()
  vehicleStatus?: CreateVehicleStatusDto;
}

export class UpdateVehicleDto {
  @ApiProperty({
    description: 'Vehicle name',
    example: 'My EV 2024',
    maxLength: 200,
    required: false,
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'External id (uuid) or null',
    example: null,
    required: false,
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  externalId?: string | null;

  @ApiProperty({
    description: 'Views count (non-negative integer)',
    example: 12,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  views?: number;

  @ApiProperty({
    description: 'Vehicle brand id (uuid)',
    example: 'bf643f66-b042-4797-9d79-a5d2284bede3',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  vehicleBrandId?: string;

  @ApiProperty({
    description: 'Vehicle model id (uuid)',
    example: 'c1a2b3d4-e5f6-7890-abcd-ef0123456789',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  vehicleModelId?: string;

  @ApiProperty({
    description: 'Vehicle status id (integer referencing VehicleStatus)',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  vehicleStatusId?: number;
}
