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
import { CategoryService } from './category.service';
import { CategoryDTO } from './category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/create-category')
  createCategory(@Body() body: CategoryDTO) {
    return this.categoryService.addCategory(body);
  }

  @Put('/update-category/:id')
  updateCategory(@Param('id') id: string, @Body() body: CategoryDTO) {
    return this.categoryService.editCategory(id, body);
  }

  @Delete('/delete-category/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.removeCategory(id);
  }

  @Get('/get-category/:id')
  getDetailCategory(@Param('id') id: string) {
    return this.categoryService.fetchDetailCategory(id);
  }

  @Get('/get-category')
  getListCategory(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('name') name?: string,
  ) {
    return this.categoryService.fetchListCategory({ limit, page }, name);
  }
}
