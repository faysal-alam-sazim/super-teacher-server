import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Exam } from "@/common/entities/exams.entity";

import { UpdateExamDto } from "./exams.dtos";

@Injectable()
export class ExamsRepository extends EntityRepository<Exam> {
  async updateOne(exam: Exam, examToUpdate: UpdateExamDto) {
    this.assign(exam, examToUpdate);

    await this.em.persistAndFlush(exam);

    return exam;
  }
}
