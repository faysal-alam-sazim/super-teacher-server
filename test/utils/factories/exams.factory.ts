import { Factory } from "@mikro-orm/seeder";

import { faker } from "@faker-js/faker";

import { Exam } from "@/common/entities/exams.entity";

export class ExamsFactory extends Factory<Exam> {
  model = Exam;

  definition(): Partial<Exam> {
    return {
      title: faker.word.words(2),
      date: faker.date.future(),
      instruction: faker.word.words(10),
    };
  }
}
