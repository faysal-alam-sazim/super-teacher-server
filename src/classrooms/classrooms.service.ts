import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsStudentsRepository } from "@/classrooms-students/classrooms-students.repository";
import { EUserRole } from "@/common/enums/roles.enum";
import { StudentsRepository } from "@/students/students.repository";
import { UsersRepository } from "@/users/users.repository";

import { CreateClassroomDto, EnrollStudentDto } from "./classrooms.dto";
import { ClassroomsRepository } from "./classrooms.repository";

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly classroomsStudentsRepository: ClassroomsStudentsRepository,
    private readonly em: EntityManager,
  ) {}

  async getClassrooms(userId: number, role: EUserRole) {
    const user = await this.usersRepository.findOneOrFail({ id: userId });

    if (role === EUserRole.TEACHER) {
      const classrooms = await this.classroomsRepository.find({ teacher: user.teacher });
      return classrooms;
    }
    // return student's enrolled classrooms
    return [];
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

  async addStudent(enrollStudentDto: EnrollStudentDto) {
    const { studentId, classroomId } = enrollStudentDto;

    await this.studentsRepository.findOneOrFail({ id: studentId });

    await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const classroomStudent = this.classroomsStudentsRepository.create({
      studentId,
      classroomId,
    });

    await this.em.persistAndFlush(classroomStudent);

    return classroomStudent;
  }
}
