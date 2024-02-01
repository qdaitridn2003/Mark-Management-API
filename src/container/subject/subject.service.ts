import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/entities';
import { PaginationType, SubjectParams } from 'src/types';
import { paginationHelper } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private subjectRepo: Repository<SubjectEntity>,
  ) {}

  async addSubject(subject: SubjectParams) {
    const createdSubject = this.subjectRepo.create({ ...subject });
    return await this.subjectRepo.save(createdSubject);
  }

  async editSubject(id: string, subject: SubjectParams) {
    const foundSubject = await this.subjectRepo.findOneBy({ id });
    if (!foundSubject) {
      throw new HttpException('Subject is not exist', HttpStatus.NOT_FOUND);
    }
    foundSubject.name = subject.name;
    foundSubject.description = subject.description;
    await this.subjectRepo.save(foundSubject);
  }

  async removeSubject(id: string) {
    const foundSubject = await this.subjectRepo.findOneBy({ id });
    if (!foundSubject) {
      throw new HttpException('Subject is not exist', HttpStatus.NOT_FOUND);
    }
    await this.subjectRepo.remove(foundSubject);
  }

  async fetchDetailSubject(id: string) {
    const foundSubject = await this.subjectRepo.findOneBy({ id });
    if (!foundSubject) {
      throw new HttpException('Subject is not exist', HttpStatus.NOT_FOUND);
    }
    return foundSubject;
  }

  async fetchListSubject(pagination: PaginationType, name?: string) {
    const { limit, offset } = paginationHelper(
      pagination.limit,
      pagination.page,
    );
    const queryBuilder = this.subjectRepo.createQueryBuilder('subject');
    const querySubject = queryBuilder.select();

    if (name) {
      querySubject.andWhere(`subject.name LIKE '%${name}%'`);
    }

    const listSubject = await querySubject
      .orderBy('subject.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
    const totalListSubject = await querySubject.getCount();
    return { listSubject, totalListSubject };
  }
}
