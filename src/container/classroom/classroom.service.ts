import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomEntity } from 'src/entities';
import { ClassroomParams, PaginationType } from 'src/types';
import { paginationHelper } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private classroomRepo: Repository<ClassroomEntity>,
  ) {}
  async addClassroom(payload: ClassroomParams) {
    const createdClassroom = await this.classroomRepo.create({ ...payload });
    return await this.classroomRepo.save(createdClassroom);
  }

  async editClassroom(id: string, payload: ClassroomParams) {
    const foundClassroom = await this.classroomRepo.findOneBy({ id });

    if (!foundClassroom) {
      throw new HttpException('Classroom is not exist', HttpStatus.NOT_FOUND);
    }

    foundClassroom.name = payload.name;
    foundClassroom.description = payload.description;

    await this.classroomRepo.save(foundClassroom);

    return { message: 'Successfully update classroom' };
  }

  async removeClassroom(id: string) {
    const foundClassroom = await this.classroomRepo.findOneBy({ id });

    if (!foundClassroom) {
      throw new HttpException('Classroom is not exist', HttpStatus.NOT_FOUND);
    }

    await this.classroomRepo.remove(foundClassroom);

    return { message: 'Successfully delete classroom' };
  }

  async fetchDetailClassroom(id: string) {
    const foundClassroom = await this.classroomRepo.findOneBy({ id });

    if (!foundClassroom) {
      throw new HttpException('Classroom is not exist', HttpStatus.NOT_FOUND);
    }

    return { classroom: foundClassroom };
  }

  async fetchListClassroom(pagination: PaginationType, name?: string) {
    const { limit, offset } = paginationHelper(
      pagination.limit,
      pagination.page,
    );

    const queryBuilder = this.classroomRepo.createQueryBuilder('classroom');
    const queryClassroom = queryBuilder.select();

    if (name) {
      queryClassroom.andWhere(`classroom.name LIKE '%${name}%'`);
    }

    const listClassroom = await queryClassroom
      .limit(limit)
      .offset(offset)
      .orderBy('classroom.createdAt', 'DESC')
      .getMany();
    const totalClassroom = await queryClassroom.getCount();

    return { listClassroom, totalClassroom };
  }
}
