import { HttpStatus, INestApplication } from "@nestjs/common";

import type { EntityManager, IDatabaseDriver, Connection, MikroORM } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";
import request from "supertest";

import { Classroom } from "@/common/entities/classrooms.entity";
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

  describe("GET /classrooms/:id", () => {
    let teacherUser: User;
    let classroom: Classroom;
    const testUserPassword = faker.internet.password();

    beforeAll(async () => {
      teacherUser = await createSingleTeacherUserInDb(dbService, {
        email: faker.internet.email(),
        password: testUserPassword,
      });

      const classrooms = await createClassroomInDb(dbService, teacherUser.teacher);
      classroom = classrooms[0];
    });

    it("should return OK(200) with the classroom created by teacher", async () => {
      const token = await getAccessToken(httpServer, teacherUser.email, testUserPassword);

      await request(httpServer)
        .get(`/classrooms/${classroom.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((response) => {
          const { data } = response.body;
          expect(data).toHaveProperty("title");
          expect(data).toHaveProperty("subject");
          expect(data).toHaveProperty("classTime");
          expect(data).toHaveProperty("days");
        });
    });

    it("returns UNAUTHORIZED(401) if user is not authenticated", () =>
      request(httpServer).get(`/classrooms/${classroom.id}`).expect(HttpStatus.UNAUTHORIZED));
  });

  describe("CREATE /classrooms", () => {
    let teacherUser: User;
    let studentUser: User;
    const testUserPassword = faker.internet.password();

    const newClassroom = {
      title: faker.word.words(2),
      subject: faker.helpers.arrayElement([
        "Physics",
        "Chemistry",
        "Math",
        "Geography",
        "Communication",
      ]),
      days: faker.helpers.multiple(faker.date.weekday),
      classTime: faker.date.anytime(),
    };

    beforeAll(async () => {
      studentUser = await createSingleStudentUserInDb(dbService, {
        email: faker.internet.email(),
        password: testUserPassword,
      });

      teacherUser = await createSingleTeacherUserInDb(dbService, {
        email: faker.internet.email(),
        password: testUserPassword,
      });
    });

    it("should return CREATED(201) with the classroom created by teacher", async () => {
      const token = await getAccessToken(httpServer, teacherUser.email, testUserPassword);

      await request(httpServer)
        .post("/classrooms")
        .set("Authorization", `Bearer ${token}`)
        .send(newClassroom)
        .expect(HttpStatus.CREATED)
        .expect((response) => {
          const { data } = response.body;
          expect(data).toEqual(
            expect.objectContaining({
              title: newClassroom.title,
              subject: newClassroom.subject,
              classTime: newClassroom.classTime.toISOString(),
              days: expect.arrayContaining(newClassroom.days),
            }),
          );
        });
    });

    it("should return FORBIDDEN(403) for trying to create student", async () => {
      const token = await getAccessToken(httpServer, studentUser.email, testUserPassword);

      await request(httpServer)
        .post("/classrooms")
        .set("Authorization", `Bearer ${token}`)
        .send(newClassroom)
        .expect(HttpStatus.FORBIDDEN);
    });

    it("returns UNAUTHORIZED(401) if user is not authenticated", () =>
      request(httpServer).post("/classrooms").send(newClassroom).expect(HttpStatus.UNAUTHORIZED));
  });
});
