import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Assignment } from "@/common/entities/assignments.entity";

import { UpdateAssignmentDto } from "./assignments.dtos";

@Injectable()
export class AssignmentsRepository extends EntityRepository<Assignment> {
  async updateOne(assignmet: Assignment, assignmentToUpdate: UpdateAssignmentDto) {
    this.assign(assignmet, assignmentToUpdate);

    await this.em.persistAndFlush(assignmet);

    return assignmet;
  }
}
