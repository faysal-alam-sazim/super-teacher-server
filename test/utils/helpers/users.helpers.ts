import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

import * as argon2 from "argon2";

import { ARGON2_OPTIONS } from "@/common/config/argon2.config";
import { EUserRole } from "@/common/enums/roles.enum";

import { MOCK_AUTH_EMAIL, MOCK_AUTH_PASS } from "../../auth/auth.mock";
import { StudentsFactory, UserFactory } from "../factories/users.factory";

export const createUserInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  config?: {
    email?: string;
    password?: string;
  },
) => {
  const defaultConfig = {
    email: MOCK_AUTH_EMAIL,
    password: MOCK_AUTH_PASS,
  };

  const password = config?.password || defaultConfig.password;
  const hashedPassword = await argon2.hash(password, ARGON2_OPTIONS);

  const values = {
    ...defaultConfig,
    ...config,
    password: hashedPassword,
  };

  const user = new UserFactory(dbService).makeOne({
    email: values.email,
    password: values.password,
  });

  await dbService.flush();

  return user;
};

export const createStudentUsersInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  numberOfUsers = 1,
) => {
  const userFactory = new UserFactory(dbService);
  const users = userFactory.make(numberOfUsers).map((user) => {
    user.role = EUserRole.STUDENT;
    return user;
  });

  const studentFactory = new StudentsFactory(dbService);
  const students = users.map((user) => {
    const student = studentFactory.makeOne();
    student.user = user;
    return student;
  });

  await dbService.persistAndFlush([...users, ...students]);
};
