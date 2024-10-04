import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { Classroom } from "@/common/entities/classrooms.entity";

import { UpdateClassroomDto } from "./classrooms.dtos";

@Injectable()
export class ClassroomsRepository extends EntityRepository<Classroom> {
  async updateOne(classroom: Classroom, updateClassroomDto: UpdateClassroomDto) {
    this.assign(classroom, updateClassroomDto);

    await this.em.persistAndFlush(classroom);

    return classroom;
  }
}
