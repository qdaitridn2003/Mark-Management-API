import { ApiProperty } from '@nestjs/swagger';

export class ProfileDTO {
  @ApiProperty({ type: 'string', example: 'example' })
  firstName: string;

  @ApiProperty({ type: 'string', example: 'example' })
  lastName: string;

  @ApiProperty({ type: 'date', example: '2003-11-11' })
  birthday: Date;

  @ApiProperty({ type: 'string', example: 'http://example.com/image.png' })
  avatar: string;
}
