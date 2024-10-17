import { Factory } from "@mikro-orm/seeder";

import { faker } from "@faker-js/faker";

import { User } from "@/common/entities/users.entity";
import { EUserGender } from "@/common/enums/gender.enum";
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
