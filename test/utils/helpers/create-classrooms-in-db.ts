import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

import { Teacher } from "@/common/entities/teachers.entity";

import { ClassroomsFactory } from "../factories/classrooms.factory";

export const createClassroomInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  teacher: Teacher,
  numberOfClassroom = 1,
) => {
  const classrooms = new ClassroomsFactory(dbService).make(numberOfClassroom, { teacher: teacher });

  await dbService.persistAndFlush(classrooms);

  return classrooms;
};
