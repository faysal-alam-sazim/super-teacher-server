import { Injectable, UnauthorizedException } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsStudentsRepository } from "@/classrooms-students/classrooms-students.repository";
import { Classroom } from "@/common/entities/classrooms.entity";
import { EUserRole } from "@/common/enums/roles.enum";
import { MailService } from "@/mail/mail.service";
import { StudentsRepository } from "@/students/students.repository";
import { UsersRepository } from "@/users/users.repository";

import { CreateClassroomDto, UpdateClassroomDto } from "./classrooms.dtos";
import { ClassroomsRepository } from "./classrooms.repository";

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly classroomsStudentsRepository: ClassroomsStudentsRepository,
    private readonly mailService: MailService,
    private readonly em: EntityManager,
  ) {}

  async getClassroomById(id: number) {
    const classroom = await this.classroomsRepository.findOneOrFail(id, {
      populate: ["teacher.user"],
    });

    return classroom;
  }

  async getClassrooms(userId: number, role: EUserRole) {
    let classrooms: Classroom[] = [];

    const user = await this.usersRepository.findOneOrFail({ id: userId });

    if (role === EUserRole.TEACHER) {
      classrooms = await this.classroomsRepository.find({ teacher: user.teacher });
    } else {
      const classroomStudents = await this.classroomsStudentsRepository.find({
        studentId: user.student.id,
      });

      const classroomIds = classroomStudents.map((classroom) => classroom.classroomId.id);
      classrooms = await this.classroomsRepository.find({ id: { $in: classroomIds } });
    }

    return classrooms;
  }

  async createClassroom(classroomDto: CreateClassroomDto, userId: number) {
    const user = await this.usersRepository.findOneOrFail({ id: userId });

    const classroom = this.classroomsRepository.create({
      ...classroomDto,
      teacher: user.teacher,
    });

    await this.em.persistAndFlush(classroom);

    return classroom;
  }

  async addStudent(classroomId: number, studentId: number) {
    const student = await this.studentsRepository.findOneOrFail(
      { id: studentId },
      { populate: ["user"] },
    );

    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const classroomStudent = this.classroomsStudentsRepository.create({
      studentId,
      classroomId,
    });

    await this.em.persistAndFlush(classroomStudent);

    await this.mailService.sendMail(
      student.user.email,
      "Confirmation of Enrollment",
      `Hello ${student.user.firstName}, you're successfully enrolled to class ${classroom.title}!`,
    );

    return classroomStudent;
  }

  async removeStudentFromClassroom(userId: number, classroomId: number, studentId: number) {
    const user = await this.usersRepository.findOneOrFail({ id: userId });
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    if (user.teacher.id !== classroom.teacher.id) {
      throw new UnauthorizedException("You are not the teacher of this classroom!");
    }

    const classroomStudent = await this.classroomsStudentsRepository.findOneOrFail({
      studentId,
      classroomId,
    });

    await this.em.removeAndFlush(classroomStudent);
  }
  async getClassroomStudents(id: number) {
    const enrolledStudents = await this.classroomsStudentsRepository.find({ classroomId: id });

    const studentIds = enrolledStudents.map((enrollment) => enrollment.studentId.id);

    const students = await this.studentsRepository.find(
      { id: { $in: studentIds } },
      { populate: ["user"] },
    );

    return students;
  }

  async updateClassroom(classroomId: number, updateClassroomDto: UpdateClassroomDto) {
    const classroom = await this.classroomsRepository.findOneOrFail({
      id: classroomId,
    });

    return this.classroomsRepository.updateOne(classroom, updateClassroomDto);
  }

  async deleteClassroom(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({
      id: classroomId,
    });

    await this.classroomsRepository.getEntityManager().removeAndFlush(classroom);
  }
}
