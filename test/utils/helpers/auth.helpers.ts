import { EntityManager } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";

import { UniqueCode } from "@/common/entities/unique-code.entity";
import { EUserGender } from "@/common/enums/gender.enum";
import { EUserRole } from "@/common/enums/roles.enum";

import { MOCK_TEACHER_EMAIL, MOCK_TEACHER_UNIQUE_CODE } from "../../auth/auth.mock";

export const getValuesWithoutUserInfo = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  gender: EUserGender.MALE,
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: EUserRole.STUDENT,
});

export const createUniqueCodeInDb = async (em: EntityManager) => {
  const uniqueCode = em.create(UniqueCode, {
    email: MOCK_TEACHER_EMAIL,
    code: MOCK_TEACHER_UNIQUE_CODE,
    resetCounter: 3,
  });

  await em.persistAndFlush(uniqueCode);
};
