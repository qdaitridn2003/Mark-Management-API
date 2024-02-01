import { Module } from '@nestjs/common';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ClassroomEntity])],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
