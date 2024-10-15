import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

import * as argon2 from "argon2";

import { ARGON2_OPTIONS } from "@/common/config/argon2.config";

import { MOCK_AUTH_EMAIL, MOCK_AUTH_PASS } from "../../auth/auth.mock";
import { UserFactory } from "../factories/users.factory";

export const createUserInDb = async (dbService: EntityManager<IDatabaseDriver<Connection>>) => {
  const defaultConfig = {
    email: MOCK_AUTH_EMAIL,
    password: MOCK_AUTH_PASS,
  };

  const password = defaultConfig.password;
  const hashedPassword = await argon2.hash(password, ARGON2_OPTIONS);

  const values = {
    ...defaultConfig,
    password: hashedPassword,
  };

  const user = new UserFactory(dbService).makeOne({
    email: values.email,
    password: values.password,
  });

  await dbService.flush();

  return user;
};
