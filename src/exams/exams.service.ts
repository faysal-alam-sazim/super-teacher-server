import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";

import { CreateExamDto, UpdateExamDto } from "./exams.dto";
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

  async updateExam(classroomId: number, examId: number, updateExamDto: UpdateExamDto) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });
    const exam = await this.examsRepository.findOneOrFail({ id: examId, classroom: classroom.id });

    this.examsRepository.assign(exam, updateExamDto);
    await this.em.persistAndFlush(exam);

    return exam;
  }

  async deleteExam(classroomId: number, examId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });
    const exam = await this.examsRepository.findOneOrFail({ id: examId, classroom: classroom.id });

    await this.em.removeAndFlush(exam);
    return exam;
  }
}
