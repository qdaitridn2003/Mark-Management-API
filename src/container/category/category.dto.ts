import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CategoryDTO {
  @ApiProperty({ type: 'string', example: 'example', required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNotEmpty()
  @IsInt()
  factor: number;

  @ApiProperty({ type: 'string', example: 'example' })
  description: string;
}
