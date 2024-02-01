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
import { ClassroomService } from './classroom.service';
import { ClassroomDTO } from './classroom.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('classroom')
@ApiTags('Classroom')
@ApiBearerAuth()
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}

  @Post('/create-classroom')
  createClassroom(@Body() body: ClassroomDTO) {
    return this.classroomService.addClassroom(body);
  }

  @Put('/update-classroom/:id')
  updateClassroom(@Param('id') id: string, @Body() body: ClassroomDTO) {
    return this.classroomService.editClassroom(id, body);
  }

  @Delete('/delete-classroom/:id')
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.removeClassroom(id);
  }

  @Get('/get-classroom/:id')
  getDetailClassroom(@Param('id') id: string) {
    return this.classroomService.removeClassroom(id);
  }

  @Get('/get-classroom')
  getListClassroom(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('name') name?: string,
  ) {
    return this.classroomService.fetchListClassroom({ limit, page }, name);
  }
}
