import { Factory } from "@mikro-orm/seeder";

import { faker } from "@faker-js/faker";

import { Student } from "@/common/entities/students.entity";
import { User } from "@/common/entities/users.entity";

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }
}

export class StudentsFactory extends Factory<Student> {
  model = Student;

  definition(): Partial<Student> {
    return {
      phoneNumber: faker.phone.number(),
      address: faker.location.streetAddress(),
    };
  }
}
