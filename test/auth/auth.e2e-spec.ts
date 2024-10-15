import { HttpStatus, INestApplication } from "@nestjs/common";

import { EntityManager, IDatabaseDriver, Connection, MikroORM } from "@mikro-orm/core";

import request from "supertest";

import { bootstrapTestServer } from "../utils/bootstrap";
import { truncateTables } from "../utils/db";
import {
  createUniqueCode,
  getStudentInfo,
  getTeacherInfo,
  getValuesWithoutUserInfo,
} from "../utils/helpers/auth.helpers";
import { THttpServer } from "../utils/types";

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
    it("registers student and returns CREATED(201) with auth token", () => {
      const studentInfo = getStudentInfo();

      request(httpServer)
        .post("/auth/signup")
        .send(studentInfo)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty("accessToken");
          expect(body.data).toHaveProperty("user");
          expect(body.data.user.firstName).toEqual(studentInfo.firstName);
          expect(body.data.user.claim).toEqual(studentInfo.role);
          expect(body.data.user.email).toEqual(studentInfo.email);
        });
    });

    it("registers teacher and returns CREATED(201) with auth token", async () => {
      await createUniqueCode(dbService);
      const { teacherWithMockValues } = getTeacherInfo();

      request(httpServer)
        .post("/auth/signup")
        .send(teacherWithMockValues)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty("accessToken");
          expect(body.data).toHaveProperty("user");
          expect(body.data.user.firstName).toEqual(teacherWithMockValues.firstName);
          expect(body.data.user.claim).toEqual(teacherWithMockValues.role);
          expect(body.data.user.email).toEqual(teacherWithMockValues.email);
        });
    });

    it("should return Unauthorized(401) as the email doesn't registerd by admin", async () => {
      await createUniqueCode(dbService);
      const { teacherWithRandomEmail } = getTeacherInfo();

      request(httpServer)
        .post("/auth/signup")
        .send(teacherWithRandomEmail)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return BAD_REQUEST(400) without user info", () => {
      const userInfo = getValuesWithoutUserInfo();
      request(httpServer).post("/auth/signup").send(userInfo).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
