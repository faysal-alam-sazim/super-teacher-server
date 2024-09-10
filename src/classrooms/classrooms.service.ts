import { Injectable, UnauthorizedException } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { ClassroomsStudentsRepository } from "@/classrooms-students/classrooms-students.repository";
import { Classroom } from "@/common/entities/classrooms.entity";
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

  async removeStudentFromClassroom(userId: number, deleteEnrollDto: EnrollStudentDto) {
    const { studentId, classroomId } = deleteEnrollDto;

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
}
