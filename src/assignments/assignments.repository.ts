import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Assignment } from "@/common/entities/assignments.entity";

@Injectable()
export class AssignmentsRepository extends EntityRepository<Assignment> {}
