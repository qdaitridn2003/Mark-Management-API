import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CategoryEntity,
  ClassroomEntity,
  ExamEntity,
  ProfileEntity,
  SubjectEntity,
} from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamEntity,
      CategoryEntity,
      SubjectEntity,
      ProfileEntity,
      ClassroomEntity,
    ]),
  ],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
