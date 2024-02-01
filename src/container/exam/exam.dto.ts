import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ExamDTO {
  @ApiProperty({ type: 'number', example: 1, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  mark: number;

  @ApiProperty({ type: 'string', example: 'example' })
  description: string;

  @ApiProperty({ type: 'string', example: '1', required: true })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ type: 'string', example: '1', required: true })
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ type: 'string', example: '1', required: true })
  @IsNotEmpty()
  classroomId: string;
}
