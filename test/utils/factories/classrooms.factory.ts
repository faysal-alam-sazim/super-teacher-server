import { Factory } from "@mikro-orm/seeder";

import { faker } from "@faker-js/faker";

import { Classroom } from "@/common/entities/classrooms.entity";

export class ClassroomsFactory extends Factory<Classroom> {
  model = Classroom;

  definition(): Partial<Classroom> {
    return {
      title: faker.word.words(2),
      subject: faker.helpers.arrayElement([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
      days: faker.helpers.multiple(faker.date.weekday),
      classTime: faker.date.anytime(),
    };
  }
}
