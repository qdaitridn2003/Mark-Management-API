import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entities';
import { RoleParams } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
  ) {}

  async addRole(role: RoleParams) {
    const createdRole = this.roleRepo.create({ ...role });
    return await this.roleRepo.save(createdRole);
  }

  async editRole(id: string, role: RoleParams) {
    const foundRole = await this.roleRepo.findOneBy({ id });
    if (!foundRole) {
      throw new HttpException('Role is not exist', HttpStatus.NOT_FOUND);
    }
    foundRole.name = role.name;
    foundRole.description = role.description;
    await this.roleRepo.save(foundRole);
  }

  async removeRole(id: string) {
    const foundRole = await this.roleRepo.findOneBy({ id });
    if (!foundRole) {
      throw new HttpException('Role is not exist', HttpStatus.NOT_FOUND);
    }
    await this.roleRepo.remove(foundRole);
  }

  async fetchDetailRole(id: string) {
    const foundRole = await this.roleRepo.findOneBy({ id });
    if (!foundRole) {
      throw new HttpException('Role is not exist', HttpStatus.NOT_FOUND);
    }
    return foundRole;
  }

  async fetchListRole() {
    const foundListRole = await this.roleRepo.find();
    return foundListRole;
  }
}
