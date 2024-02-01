import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryEntity,
  ClassroomEntity,
  ExamEntity,
  SubjectEntity,
} from 'src/entities';
import { ExamParams, PaginationType } from 'src/types';
import { paginationHelper } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity) private examRepo: Repository<ExamEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(SubjectEntity)
    private subjectRepo: Repository<SubjectEntity>,
    @InjectRepository(ClassroomEntity)
    private classroomRepo: Repository<ClassroomEntity>,
  ) {}

  async addExam(profileId: string, payload: ExamParams) {
    const createdExam = this.examRepo.create({
      mark: payload.mark,
      classroom: { id: payload.classroomId },
      description: payload.description,
      category: { id: payload.categoryId },
      subject: { id: payload.subjectId },
      profile: { id: profileId },
    });
    return await this.examRepo.save(createdExam);
  }

  async editExam(id: string, payload: ExamParams) {
    const foundExam = await this.examRepo.findOneBy({ id });
    const foundCategory = await this.categoryRepo.findOneBy({
      id: payload.categoryId,
    });
    const foundSubject = await this.subjectRepo.findOneBy({
      id: payload.subjectId,
    });
    const foundClassroom = await this.classroomRepo.findOneBy({
      id: payload.classroomId,
    });

    if (!foundExam) {
      throw new HttpException('Exam is not exist', HttpStatus.NOT_FOUND);
    }

    foundExam.mark = payload.mark;
    foundExam.description = payload.description;
    foundExam.category = foundCategory;
    foundExam.subject = foundSubject;
    foundExam.classroom = foundClassroom;

    await this.examRepo.save(foundExam);

    return { message: 'Successfully update exam' };
  }

  async removeExam(id: string) {
    const foundExam = await this.examRepo.findOneBy({ id });

    if (!foundExam) {
      throw new HttpException('Exam is not exist', HttpStatus.NOT_FOUND);
    }

    await this.examRepo.remove(foundExam);

    return { message: 'Successfully delete exam' };
  }

  async fetchDetailExam(id: string) {
    const foundExam = await this.examRepo.findOne({
      where: { id },
      relations: ['category', 'subject'],
    });

    if (!foundExam) {
      throw new HttpException('Exam is not exist', HttpStatus.NOT_FOUND);
    }

    return { exam: foundExam };
  }

  async fetchListExam(
    profileId: string,
    pagination: PaginationType,
    subjectIds?: string,
    categoryIds?: string,
    classroomIds?: string,
  ) {
    const { limit, offset } = paginationHelper(
      pagination.limit,
      pagination.page,
    );

    const queryBuilder = this.examRepo.createQueryBuilder('exam');
    const queryExam = queryBuilder
      .select('*')
      .innerJoin('exam.subject', 'subject')
      .innerJoin('exam.category', 'category')
      .where('exam.profile = :profileId', { profileId });

    if (subjectIds) {
      const handledSubjectIds = `('${(JSON.parse(subjectIds) as string[]).join("','")}')`;
      queryExam.andWhere(`exam.subject IN ${handledSubjectIds}`);
    }

    if (categoryIds) {
      const handledCategoryIds = `('${(JSON.parse(categoryIds) as string[]).join("','")}')`;
      queryExam.andWhere(`exam.category IN ${handledCategoryIds}`);
    }

    if (classroomIds) {
      const handledCategoryIds = `('${(JSON.parse(classroomIds) as string[]).join("','")}')`;
      queryExam.andWhere(`exam.classroom IN ${handledCategoryIds}`);
    }

    const listExam = await queryExam.limit(limit).offset(offset).getRawMany();
    const totalExam = await queryExam.getCount();

    return { listExam, totalExam };
  }
}
