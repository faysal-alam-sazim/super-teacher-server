import { HttpStatus, INestApplication } from "@nestjs/common";

import type { EntityManager, IDatabaseDriver, Connection, MikroORM } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";
import request from "supertest";

import { User } from "@/common/entities/users.entity";

import { bootstrapTestServer } from "../utils/bootstrap";
import { truncateTables } from "../utils/db";
import { getAccessToken } from "../utils/helpers/access-token.helpers";
import { createClassroomInDb } from "../utils/helpers/create-classrooms-in-db";
import { enrollStudentInClassroomsInDb } from "../utils/helpers/enroll-student-in-classrooms";
import {
  createSingleStudentUserInDb,
  createSingleTeacherUserInDb,
} from "../utils/helpers/users.helpers";
import { THttpServer } from "../utils/types";

describe("ClassroomsController (e2e)", () => {
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

  describe("GET /classrooms", () => {
    let studentUser: User;
    let teacherUser: User;

    const testUserPassword = faker.internet.password();

    beforeAll(async () => {
      studentUser = await createSingleStudentUserInDb(dbService, {
        email: faker.internet.email(),
        password: testUserPassword,
      });
      teacherUser = await createSingleTeacherUserInDb(dbService, {
        email: faker.internet.email(),
        password: testUserPassword,
      });

      const classrooms = await createClassroomInDb(dbService, teacherUser.teacher, 5);
      await enrollStudentInClassroomsInDb(dbService, classrooms, [studentUser.student]);
    });

    it("should return OK(200) with classrooms created by teacher", async () => {
      const token = await getAccessToken(httpServer, teacherUser.email, testUserPassword);

      await request(httpServer)
        .get("/classrooms")
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((response) => {
          const { data } = response.body;
          expect(Array.isArray(data)).toBe(true);
        });
    });

    it("should return OK(200) with classrooms enrolled of student", async () => {
      const token = await getAccessToken(httpServer, studentUser.email, testUserPassword);

      await request(httpServer)
        .get("/classrooms")
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((response) => {
          const { data } = response.body;
          expect(Array.isArray(data)).toBe(true);
        });
    });

    it("returns UNAUTHORIZED(401) if user is not authenticated", () =>
      request(httpServer).get("/classrooms").expect(HttpStatus.UNAUTHORIZED));
  });
});
