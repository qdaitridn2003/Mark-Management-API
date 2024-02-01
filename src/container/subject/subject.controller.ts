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
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectDTO } from './subject.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('subject')
@ApiTags('Subject')
@ApiBearerAuth()
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post('/create-subject')
  createSubject(@Body() body: SubjectDTO) {
    return this.subjectService.addSubject(body);
  }

  @Put('/update-subject/:id')
  updateSubject(@Param('id') id: string, @Body() body: SubjectDTO) {
    return this.subjectService.editSubject(id, body);
  }

  @Delete('/delete-subject/:id')
  deleteSubject(@Param('id') id: string) {
    return this.subjectService.removeSubject(id);
  }

  @Get('/get-subject/:id')
  getDetailSubject(@Param('id') id: string) {
    return this.subjectService.fetchDetailSubject(id);
  }

  @Get('/get-subject')
  getListSubject(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('name') name?: string,
  ) {
    return this.subjectService.fetchListSubject({ limit, page }, name);
  }
}
