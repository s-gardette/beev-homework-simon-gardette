import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  IsNumber,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeEnum } from '../model.entities';

export class CreateModelDto {
  @ApiProperty({
    description: 'Model name',
    example: 'Corolla',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Brand id (uuid) the model belongs to',
    example: 'bf643f66-b042-4797-9d79-a5d2284bede3',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Battery capacity in kWh',
    example: 55,
    required: true,
  })
  @IsInt()
  batteryCapacity: number;

  @ApiProperty({
    description: 'Average consumption in Wh/km',
    example: 150,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  averageConsumption: number;

  @ApiProperty({
    description: 'Emissions in gCO2/km',
    example: 0,
    required: true,
  })
  @IsNumber()
  emissionGCO2: number;

  @ApiProperty({
    description: 'Powertrain type',
    enum: TypeEnum,
    example: TypeEnum.BEV,
    required: true,
  })
  @IsEnum(TypeEnum)
  Type: TypeEnum;
}
