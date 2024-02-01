import { Controller, Get, Query, Res } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtPayload } from 'src/types';

@Controller('statistical')
@ApiTags('Statistical')
@ApiBearerAuth()
export class StatisticalController {
  constructor(private statisticalService: StatisticalService) {}

  @Get('/marks')
  getAverageMark(
    @Res({ passthrough: true }) res: Response,
    @Query('classroomId') classroomId: string,
  ) {
    const { profileId } = res.locals as JwtPayload;
    return this.statisticalService.fetchMarks(profileId, classroomId);
  }
}
