import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ClassroomDTO {
  @ApiProperty({ type: 'string', example: 'example', required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', example: 'example', required: true })
  description: string;
}
