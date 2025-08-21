import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Brand name',
    example: 'Toyota',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
