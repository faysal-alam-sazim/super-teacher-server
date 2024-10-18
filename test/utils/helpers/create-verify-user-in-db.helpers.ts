import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

import { User } from "@/common/entities/users.entity";
import { VerifyUsers } from "@/common/entities/verify-users.entity";

export const createVerifyUserInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  user: User,
  verify: boolean,
) => {
  const verifyUser = dbService.create(VerifyUsers, {
    otp: faker.string.numeric({ length: 6 }),
    expiresAt: dayjs().add(5, "minute").toDate(),
    isChecked: verify,
    user,
  });

  await dbService.persistAndFlush(verifyUser);

  return verifyUser;
};
