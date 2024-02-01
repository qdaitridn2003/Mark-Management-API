import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamEntity } from 'src/entities';
import { MarkQuery } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticalService {
  constructor(
    @InjectRepository(ExamEntity) private examRepo: Repository<ExamEntity>,
  ) {}

  async fetchMarks(profileId: string, classroomId: string) {
    const queryTableMark: MarkQuery[] = await this.examRepo.query(`
      WITH SubQuery AS (
        SELECT
          exams.subjectId,
          subjects.name AS subjectName,
          (SUM(exams.mark) * categories.factor) AS totalMark,
          exams.categoryId,
          categories.factor
        FROM
          exams
        INNER JOIN
          categories ON exams.categoryId = categories.id
        INNER JOIN
          subjects ON exams.subjectId = subjects.id
        WHERE
          exams.profileId = '${profileId}'
        AND
          exams.classroomId = '${classroomId}'
        GROUP BY
          exams.subjectId, exams.categoryId
      )
      SELECT
        SubQuery.subjectId,
        SubQuery.subjectName,
        (SUM(SubQuery.totalMark) / SUM(SubQuery.factor)) AS averageMark,
        GROUP_CONCAT(CASE WHEN categories.name = 'Oral Test' THEN exams.mark END) as oralMark,
        GROUP_CONCAT(CASE WHEN categories.name = '15 Minutes Test' THEN exams.mark END) quarterMark ,
        GROUP_CONCAT(CASE WHEN categories.name = 'A Lesson Test' THEN exams.mark END) lessonMark,
        GROUP_CONCAT(CASE WHEN categories.name = 'Mid Semester Test' THEN exams.mark END) midSemesterMark,
        GROUP_CONCAT(CASE WHEN categories.name = 'Semester Test' THEN exams.mark END) as semesterMark
      FROM
        SubQuery
      INNER JOIN
        exams ON SubQuery.subjectId = exams.subjectId AND SubQuery.categoryId = exams.categoryId
      INNER JOIN
        categories ON exams.categoryId = categories.id
      GROUP BY
        SubQuery.subjectId, SubQuery.subjectName;
    `);

    let totalAverageMark = 0;
    queryTableMark.forEach((item: MarkQuery) => {
      totalAverageMark += parseFloat(item.averageMark);
    });
    const finalMark = totalAverageMark / queryTableMark.length;
    const academicPerformance =
      finalMark >= 9
        ? 'High Distinction'
        : finalMark >= 8
          ? 'Distinction'
          : finalMark >= 6.5
            ? 'Credit'
            : finalMark >= 5
              ? 'Strong Pass'
              : 'Poor';
    return { marks: [...queryTableMark], finalMark, academicPerformance };
  }
}
