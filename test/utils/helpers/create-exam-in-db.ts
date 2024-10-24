import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

import { Classroom } from "@/common/entities/classrooms.entity";

import { ExamsFactory } from "../factories/exams.factory";

export const createExamsInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  classroom: Classroom,
  numberOfExams = 1,
) => {
  const exams = new ExamsFactory(dbService).make(numberOfExams, { classroom: classroom });

  await dbService.persistAndFlush(exams);

  return exams;
};
