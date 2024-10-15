import { EntityManager } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";

import { UniqueCode } from "@/common/entities/unique-code.entity";
import { EStudentEducationLevel } from "@/common/enums/educationLevel.enum";
import { EUserGender } from "@/common/enums/gender.enum";
import { EHighestEducationLevel } from "@/common/enums/highestEducationLevel.enum";
import { EMedium } from "@/common/enums/medium.enum";
import { EUserRole } from "@/common/enums/roles.enum";

import { MOCK_TEACHER_EMAIL, MOCK_TEACHER_UNIQUE_CODE } from "../../auth/auth.mock";

export const getStudentInfo = () => {
  const studentInfo = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: EUserGender.MALE,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: EUserRole.STUDENT,
    studentInput: {
      address: faker.location.streetAddress(),
      phoneNumber: faker.phone.number(),
      educationLevel: EStudentEducationLevel.SCHOOL,
      medium: EMedium.BANGLA,
      class: "Class 1",
    },
  };

  return studentInfo;
};

export const getTeacherInfo = () => {
  const teacherWithMockValues = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: EUserGender.MALE,
    email: MOCK_TEACHER_EMAIL,
    password: faker.internet.password(),
    role: EUserRole.STUDENT,
    teacherInput: {
      code: MOCK_TEACHER_UNIQUE_CODE,
      majorSubject: faker.helpers.arrayElement([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
      highestEducationLevel: faker.helpers.enumValue(EHighestEducationLevel),
      subjectsToTeach: faker.helpers.arrayElements([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
    },
  };

  const teacherWithRandomEmail = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: EUserGender.MALE,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: EUserRole.STUDENT,
    teacherInput: {
      code: MOCK_TEACHER_UNIQUE_CODE,
      majorSubject: faker.helpers.arrayElement([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
      highestEducationLevel: faker.helpers.enumValue(EHighestEducationLevel),
      subjectsToTeach: faker.helpers.arrayElements([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
    },
  };

  return { teacherWithMockValues, teacherWithRandomEmail };
};

export const getValuesWithoutUserInfo = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  gender: EUserGender.MALE,
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: EUserRole.STUDENT,
});

export const createUniqueCode = async (em: EntityManager) => {
  const uniqueCode = em.create(UniqueCode, {
    email: MOCK_TEACHER_EMAIL,
    code: MOCK_TEACHER_UNIQUE_CODE,
    resetCounter: 3,
  });

  await em.persistAndFlush(uniqueCode);
};
