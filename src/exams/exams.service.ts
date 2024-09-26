import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { ClassroomsService } from "@/classrooms/classrooms.service";
import { MailService } from "@/mail/mail.service";

import { CreateExamDto, UpdateExamDto } from "./exams.dtos";
import { ExamsRepository } from "./exams.repository";

@Injectable()
export class ExamsService {
  constructor(
    private readonly examsRepository: ExamsRepository,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly em: EntityManager,
    private readonly classroomsService: ClassroomsService,
    private readonly mailService: MailService,
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

    const enrolledStudents = await this.classroomsService.getClassroomStudents(classroom.id);

    enrolledStudents.map(async (student) => {
      await this.mailService.sendMail(
        student.user.email,
        `New Exam in Classroom ${classroom.title}`,
        `Hello ${student.user.firstName}, ${exam.title} is added in class ${classroom.title}`,
      );
    });

    return exam;
  }

  async updateExam(classroomId: number, examId: number, updateExamDto: UpdateExamDto) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const exam = await this.examsRepository.findOneOrFail({ id: examId, classroom: classroom.id });

    return this.examsRepository.updateOne(exam, updateExamDto);
  }

  async deleteExam(classroomId: number, examId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const exam = await this.examsRepository.findOneOrFail({ id: examId, classroom: classroom.id });

    await this.em.removeAndFlush(exam);
  }
}
