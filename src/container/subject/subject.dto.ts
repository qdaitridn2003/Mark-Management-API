import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubjectDTO {
  @ApiProperty({ type: 'string', example: 'example', required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', example: 'example' })
  description: string;
}
