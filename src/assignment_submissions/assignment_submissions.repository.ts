import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { AssignmentSubmission } from "@/common/entities/assignment-submissions.entity";

@Injectable()
export class AssignmentSubmissionsRepository extends EntityRepository<AssignmentSubmission> {}
