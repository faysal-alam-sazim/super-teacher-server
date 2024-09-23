import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";

import { CreateExamDto } from "./exams.dtos";
import { ExamsRepository } from "./exams.repository";

@Injectable()
export class ExamsService {
  constructor(
    private readonly examsRepository: ExamsRepository,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly em: EntityManager,
  ) {}

  async getExams(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const exams = await this.examsRepository.find({ classroom: classroom.id });

    return exams;
  }

  async createExam(classroomId: number, createExamDto: CreateExamDto) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const exam = this.examsRepository.create({ ...createExamDto, classroom: classroom.id });

    await this.em.persistAndFlush(exam);

    return exam;
  }
}
