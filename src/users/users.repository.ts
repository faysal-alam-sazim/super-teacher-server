import { BadRequestException, Injectable } from "@nestjs/common";

import { EntityRepository, wrap } from "@mikro-orm/postgresql";

import { CreateUserDto } from "@/auth/auth.dtos";
import { Student } from "@/common/entities/students.entity";
import { Teacher } from "@/common/entities/teachers.entity";
import { EUserRole } from "@/common/enums/roles.enum";

import { User } from "../common/entities/users.entity";

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  createStudent(createUserDto: CreateUserDto): Promise<User> {
    return this.em.transactional(async (em) => {
      const { firstName, lastName, gender, email, password, studentInput } = createUserDto;

      if (!studentInput) {
        throw new BadRequestException("Student Information required");
      }

      const {
        address,
        phoneNumber,
        educationLevel,
        medium,
        class: className,
        degree,
        degreeName,
        semesterYear,
      } = studentInput;

      const user = new User(firstName, lastName, gender, email, password, EUserRole.STUDENT);
      const student = new Student(
        address,
        phoneNumber,
        educationLevel,
        medium,
        className,
        degree,
        degreeName,
        semesterYear,
      );

      wrap(student).assign({ user });

      em.persist([user, student]);
      await em.flush();
      return user;
    });
  }

  createTeacher(createUserDto: CreateUserDto): Promise<User> {
    return this.em.transactional(async (em) => {
      const { firstName, lastName, gender, email, password, teacherInput } = createUserDto;

      if (!teacherInput) {
        throw new BadRequestException("Teacher Information required");
      }

      const { majorSubject, highestEducationLevel, subjectsToTeach } = teacherInput;

      const user = new User(firstName, lastName, gender, email, password, EUserRole.TEACHER);
      const teacher = new Teacher(majorSubject, highestEducationLevel, subjectsToTeach);

      wrap(teacher).assign({ user });

      em.persist([user, teacher]);
      await em.flush();

      return user;
    });
  }
}
