import { Factory } from "@mikro-orm/seeder";

import { faker } from "@faker-js/faker";

import { Student } from "@/common/entities/students.entity";
import { Teacher } from "@/common/entities/teachers.entity";
import { User } from "@/common/entities/users.entity";
import { EStudentEducationLevel } from "@/common/enums/educationLevel.enum";
import { EUserGender } from "@/common/enums/gender.enum";
import { EHighestEducationLevel } from "@/common/enums/highestEducationLevel.enum";
import { EMedium } from "@/common/enums/medium.enum";
import { EUserRole } from "@/common/enums/roles.enum";

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.helpers.enumValue(EUserGender),
      role: faker.helpers.enumValue(EUserRole),
    };
  }
}

export class StudentsFactory extends Factory<Student> {
  model = Student;

  definition(): Partial<Student> {
    return {
      address: faker.location.streetAddress(),
      phoneNumber: faker.phone.number(),
      educationLevel: EStudentEducationLevel.SCHOOL,
      medium: EMedium.BANGLA,
      class: "Class 1",
    };
  }
}

export class TeacherFactory extends Factory<Teacher> {
  model = Teacher;

  definition(): Partial<Teacher> {
    return {
      majorSubject: faker.helpers.arrayElement([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
      highestEducationLevel: faker.helpers.enumValue(EHighestEducationLevel),
      subjectsToTeach: faker.helpers.arrayElements([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
    };
  }
}
