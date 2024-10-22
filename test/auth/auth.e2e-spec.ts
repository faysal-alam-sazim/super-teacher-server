import { HttpStatus, INestApplication } from "@nestjs/common";

import { EntityManager, IDatabaseDriver, Connection, MikroORM } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";
import request from "supertest";

import { EStudentEducationLevel } from "@/common/enums/educationLevel.enum";
import { EUserGender } from "@/common/enums/gender.enum";
import { EHighestEducationLevel } from "@/common/enums/highestEducationLevel.enum";
import { EMedium } from "@/common/enums/medium.enum";
import { EUserRole } from "@/common/enums/roles.enum";

import { bootstrapTestServer } from "../utils/bootstrap";
import { truncateTables } from "../utils/db";
import { createUniqueCodeInDb, getValuesWithoutUserInfo } from "../utils/helpers/auth.helpers";
import { createUserInDb } from "../utils/helpers/users.helpers";
import { THttpServer } from "../utils/types";
import {
  MOCK_AUTH_EMAIL,
  MOCK_AUTH_PASS,
  MOCK_TEACHER_EMAIL,
  MOCK_TEACHER_UNIQUE_CODE,
} from "./auth.mock";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let dbService: EntityManager<IDatabaseDriver<Connection>>;
  let httpServer: THttpServer;
  let orm: MikroORM<IDatabaseDriver<Connection>>;

  beforeAll(async () => {
    const { appInstance, dbServiceInstance, httpServerInstance, ormInstance } =
      await bootstrapTestServer();
    app = appInstance;
    dbService = dbServiceInstance;
    httpServer = httpServerInstance;
    orm = ormInstance;
  });

  afterAll(async () => {
    await truncateTables(dbService);
    await orm.close();
    await httpServer.close();
    await app.close();
  });

  beforeEach(async () => {
    await truncateTables(dbService);
  });

  afterEach(() => {
    dbService.clear();
  });

  describe("POST /auth/signup", () => {
    type TStudentInput = {
      address: string;
      phoneNumber: string;
      educationLevel: EStudentEducationLevel;
      medium: EMedium;
      class: string;
    };

    type TTeacherInput = {
      code: string;
      majorSubject: string;
      highestEducationLevel: EHighestEducationLevel;
      subjectsToTeach: string[];
    };

    type TUser = {
      firstName: string;
      lastName: string;
      gender: EUserGender;
      email: string;
      password: string;
      role: EUserRole;
      teacherInput?: TTeacherInput;
      studentInput?: TStudentInput;
    };

    let teacherWithMockValues: TUser;
    let teacherWithRandomEmail: TUser;
    let studentInfo: TUser;

    beforeAll(() => {
      teacherWithMockValues = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: EUserGender.MALE,
        email: MOCK_TEACHER_EMAIL,
        password: faker.internet.password(),
        role: EUserRole.TEACHER,
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

      teacherWithRandomEmail = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: EUserGender.MALE,
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: EUserRole.TEACHER,
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

      studentInfo = {
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
    });

    it("registers student and returns CREATED(201) with auth token", async () => {
      await request(httpServer)
        .post("/auth/signup")
        .send(studentInfo)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty("accessToken");
          expect(body.data).toHaveProperty("user");
          expect(body.data.user).toEqual(
            expect.objectContaining({
              firstName: studentInfo.firstName,
              claim: studentInfo.role,
              email: studentInfo.email,
            }),
          );
        });
    });

    it("registers teacher and returns CREATED(201) with auth token", async () => {
      await createUniqueCodeInDb(dbService);

      await request(httpServer)
        .post("/auth/signup")
        .send(teacherWithMockValues)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty("accessToken");
          expect(body.data).toHaveProperty("user");
          expect(body.data.user).toEqual(
            expect.objectContaining({
              firstName: teacherWithMockValues.firstName,
              claim: teacherWithMockValues.role,
              email: teacherWithMockValues.email,
            }),
          );
        });
    });

    it("should return Unauthorized(401) as the email doesn't registerd by admin", async () => {
      await createUniqueCodeInDb(dbService);

      await request(httpServer)
        .post("/auth/signup")
        .send(teacherWithRandomEmail)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return BAD_REQUEST(400) without user info", async () => {
      const userInfo = getValuesWithoutUserInfo();
      await request(httpServer).post("/auth/signup").send(userInfo).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      await createUserInDb(dbService);
    });

    it("should return 201 Created with proper credentials", () =>
      request(httpServer)
        .post("/auth/login")
        .send({ email: MOCK_AUTH_EMAIL, password: MOCK_AUTH_PASS })
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data.user.email).toEqual(MOCK_AUTH_EMAIL);
          expect(body.data).toHaveProperty("accessToken");
          expect(body.data.user.password).toBeUndefined();
        }));

    it("should return 401 Unauthorized with wrong credentials", () =>
      request(httpServer)
        .post("/auth/login")
        .send({ email: MOCK_AUTH_EMAIL, password: "wrongpassword" })
        .expect(HttpStatus.UNAUTHORIZED));

    it("should return 401 Unauthorized without authentication params", () =>
      request(httpServer).post("/auth/login").expect(HttpStatus.UNAUTHORIZED));
  });
});
