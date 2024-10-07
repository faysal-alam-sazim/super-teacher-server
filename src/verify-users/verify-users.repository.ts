import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { VerifyUsers } from "@/common/entities/verify-users.entity";

@Injectable()
export class VerifyUsersRepository extends EntityRepository<VerifyUsers> {}
