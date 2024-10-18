import { HttpStatus, INestApplication } from "@nestjs/common";

import type { EntityManager, IDatabaseDriver, Connection, MikroORM } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";
import request from "supertest";

import { User } from "@/common/entities/users.entity";
import { EUserRole } from "@/common/enums/roles.enum";

import { MOCK_TEACHER_EMAIL } from "../auth/auth.mock";
import { bootstrapTestServer } from "../utils/bootstrap";
import { truncateTables } from "../utils/db";
import { getAccessToken } from "../utils/helpers/access-token.helpers";
import {
  createSingleStudentUserInDb,
  createSingleTeacherUserInDb,
  createStudentUsersInDb,
  createUserInDb,
} from "../utils/helpers/users.helpers";
import { THttpServer } from "../utils/types";

describe("UsersController (e2e)", () => {
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

  afterEach(() => {
    dbService.clear();
  });

  describe("GET /users/me", () => {
    const testUserEmail = faker.internet.email();
    const testUserPassword = faker.internet.password();

    let token: string;
    let user: User;

    beforeAll(async () => {
      user = await createUserInDb(dbService, {
        email: testUserEmail,
        password: testUserPassword,
      });

      token = await getAccessToken(httpServer, testUserEmail, testUserPassword);
    });

    it("returns OK(200) with user data", () =>
      request(httpServer)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body.data).toEqual({
            id: expect.any(Number),
            email: testUserEmail,
            claim: user.role,
            firstName: user.firstName,
          });
        }));

    it("returns UNAUTHORIZED(401) if user is not authenticated", () =>
      request(httpServer).get("/users/me").expect(HttpStatus.UNAUTHORIZED));
  });

  describe("GET /users/students", () => {
    beforeAll(async () => {
      await createStudentUsersInDb(dbService, 5);
    });

    it("returns OK (200) with all student user data", () => {
      request(httpServer)
        .get("/users/students")
        .expect(HttpStatus.OK)
        .expect((response) => {
          const { data } = response.body;
          expect(Array.isArray(data)).toBe(true);

          const student = data[0];
          expect(student).toHaveProperty("email");
          expect(student).toHaveProperty("firstName");
          expect(student).toHaveProperty("lastName");
          expect(student).toHaveProperty("role", "STUDENT");
        });
    });
  });

  describe("GET /users/profile", () => {
    const testStudentEmail = faker.internet.email();
    const testStudentPassword = faker.internet.password();

    const testTeacherEmail = MOCK_TEACHER_EMAIL;
    const testTeacherPassword = faker.internet.password();

    beforeAll(async () => {
      await createSingleStudentUserInDb(dbService, {
        email: testStudentEmail,
        password: testStudentPassword,
      });

      await createSingleTeacherUserInDb(dbService, {
        email: testTeacherEmail,
        password: testTeacherPassword,
      });
    });

    it("returns OK(200) with student profile data", async () => {
      const token = await getAccessToken(httpServer, testStudentEmail, testStudentPassword);

      await request(httpServer)
        .get("/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((response) => {
          const { data } = response.body;
          expect(data).toHaveProperty("email");
          expect(data).toHaveProperty("firstName");
          expect(data).toHaveProperty("lastName");
          expect(data).toHaveProperty("role", EUserRole.STUDENT);
          expect(data.student).toHaveProperty("educationLevel");
        });
    });

    it("returns OK(200) with teacher profile data", async () => {
      const token = await getAccessToken(httpServer, testTeacherEmail, testTeacherPassword);

      await request(httpServer)
        .get("/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((response) => {
          const { data } = response.body;
          expect(data).toHaveProperty("email");
          expect(data).toHaveProperty("firstName");
          expect(data).toHaveProperty("lastName");
          expect(data).toHaveProperty("role", EUserRole.TEACHER);
          expect(data.teacher).toHaveProperty("majorSubject");
          expect(data.teacher).toHaveProperty("highestEducationLevel");
          expect(data.teacher).toHaveProperty("subjectsToTeach");
          expect(Array.isArray(data.teacher.subjectsToTeach)).toBe(true);
        });
    });

    it("returns UNAUTHORIZED(401) if user is not authenticated", () =>
      request(httpServer).get("/users/profile").expect(HttpStatus.UNAUTHORIZED));
  });
});
