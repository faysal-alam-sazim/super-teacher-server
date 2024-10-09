import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

import * as argon2 from "argon2";

import { ARGON2_OPTIONS } from "@/common/config/argon2.config";
import { EStudentEducationLevel } from "@/common/enums/educationLevel.enum";
import { EUserGender } from "@/common/enums/gender.enum";
import { EUserRole } from "@/common/enums/roles.enum";

import { MOCK_AUTH_EMAIL, MOCK_AUTH_PASS } from "../../auth/auth.mock";
import { StudentsFactory, UserFactory } from "../factories/users.factory";


export const createStudentInDb = async (
  dbService: EntityManager<IDatabaseDriver<Connection>>,
  config?: {
    email?: string;
    password?: string;
    gender?: EUserGender;
    role?: EUserRole;
  },
) => {
  const defaultConfig = {
    email: MOCK_AUTH_EMAIL,
    password: MOCK_AUTH_PASS,
    role: EUserRole.STUDENT,
    gender: EUserGender.MALE,
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
    role: values.role,
    gender: values.gender,
  });

  const student = new StudentsFactory(dbService).makeOne({
    educationLevel: EStudentEducationLevel.COLLEGE,
    class: "Class 11",
    medium: "Bangla",
  });

  user.student = student;

  await dbService.flush();

  return user;
};
