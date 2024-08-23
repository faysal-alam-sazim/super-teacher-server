import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { User } from "../common/entities/users.entity";

@Injectable()
export class UsersRepository extends EntityRepository<User> {}
