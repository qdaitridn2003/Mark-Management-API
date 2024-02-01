import { Module } from '@nestjs/common';
import { StatisticalController } from './statistical.controller';
import { StatisticalService } from './statistical.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ExamEntity])],
  controllers: [StatisticalController],
  providers: [StatisticalService],
})
export class StatisticalModule {}
