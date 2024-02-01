import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDTO } from './role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('/create-role')
  createRole(@Body() body: RoleDTO) {
    return this.roleService.addRole(body);
  }

  @Put('/update-role/:id')
  updateRole(@Param('id') id: string, @Body() body: RoleDTO) {
    return this.roleService.editRole(id, body);
  }

  @Delete('/delete-role/:id')
  deleteRole(@Param('id') id: string) {
    return this.roleService.removeRole(id);
  }

  @Get('/get-role/:id')
  getDetailRole(@Param('id') id: string) {
    return this.roleService.fetchDetailRole(id);
  }

  @Get('/get-role')
  getListRole() {
    return this.roleService.fetchListRole();
  }
}
