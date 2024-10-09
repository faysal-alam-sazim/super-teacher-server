import { HttpStatus, INestApplication } from "@nestjs/common";

import type { EntityManager, IDatabaseDriver, Connection, MikroORM } from "@mikro-orm/core";

import { faker } from "@faker-js/faker";
import request from "supertest";

// import { RegisterUserDto } from "@/users/users.dtos";

// import { seedPermissionsData } from "../auth/auth.helpers";
import { User } from "@/common/entities/users.entity";

import { bootstrapTestServer } from "../utils/bootstrap";
import { truncateTables } from "../utils/db";
// import { getAccessToken } from "../utils/helpers/access-token.helpers";
// import { createUserInDb } from "../utils/helpers/create-user-in-db.helpers";
import { getAccessToken } from "../utils/helpers/access-token.helpers";
import { createStudentInDb } from "../utils/helpers/create-user-in-db.helpers";
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
      user = await createStudentInDb(dbService, {
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
});
