import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { Response } from 'express';
import { ExamDTO } from './exam.dto';
import { JwtPayload } from 'src/types';

@Controller('exam')
@ApiTags('Exam')
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post('/create-exam')
  createExam(@Res({ passthrough: true }) res: Response, @Body() body: ExamDTO) {
    const { profileId } = res.locals as JwtPayload;
    return this.examService.addExam(profileId, body);
  }

  @Put('/update-exam/:id')
  updateExam(@Param('id') id: string, @Body() body: ExamDTO) {
    return this.examService.editExam(id, body);
  }

  @Delete('/delete-exam/:id')
  deleteExam(@Param('id') id: string) {
    return this.examService.removeExam(id);
  }

  @Get('/get-exam/:id')
  getDetailExam(@Param('id') id: string) {
    return this.examService.fetchDetailExam(id);
  }

  @Get('/get-exam')
  getListExam(
    @Res({ passthrough: true }) res: Response,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('subjectIds') subjectIds?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('classroomIds') classroomIds?: string,
  ) {
    const { profileId } = res.locals as JwtPayload;

    return this.examService.fetchListExam(
      profileId,
      { limit, page },
      subjectIds,
      categoryIds,
      classroomIds,
    );
  }
}
