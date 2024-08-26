import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Student } from "@/common/entities/students.entity";
import { EUserRole } from "@/common/enums/roles.enum";

import { User } from "../common/entities/users.entity";
import { CreateUserDto } from "./users.dtos";

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  async createStudent(createUserDto: CreateUserDto): Promise<User> {
    let user: User;

    await this.em.transactional(async (em) => {
      const {
        firstName,
        lastName,
        gender,
        email,
        password,
        studentInput: {
          address,
          phoneNumber,
          educationLevel,
          medium,
          class: className,
          degree,
          degreeName,
          semesterYear,
        },
      } = createUserDto;

      user = new User(firstName, lastName, gender, email, password);
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

      user.role = EUserRole.STUDENT;
      user.student = student;
      student.user = user;

      em.persist([user, student]);
      await em.flush();
    });

    return user!;
  }
}
