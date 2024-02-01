import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/entities';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
