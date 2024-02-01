import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { SubjectEntity } from './subject.entity';
import { ProfileEntity } from './profile.entity';
import { ClassroomEntity } from './classroom.entity';

@Entity({ name: 'exams' })
export class ExamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  mark: number;

  @Column({ default: '' })
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => SubjectEntity, (subject) => subject.exams)
  subject: SubjectEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.exams)
  category: CategoryEntity;

  @ManyToOne(() => ProfileEntity, (profile) => profile.exams)
  profile: ProfileEntity;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.exams)
  classroom: ClassroomEntity;
}
