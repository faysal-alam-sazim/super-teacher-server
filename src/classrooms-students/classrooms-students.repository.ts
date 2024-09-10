import { Injectable } from "@nestjs/common";

import { EntityRepository } from "@mikro-orm/postgresql";

import { ClassroomStudent } from "@/common/entities/classrooms-students.entity";

@Injectable()
export class ClassroomsStudentsRepository extends EntityRepository<ClassroomStudent> {
  async deleteOne(clssroomStudent: ClassroomStudent) {
    await this.em.removeAndFlush(clssroomStudent);
    return { message: "Removed Student from Classroom!" };
  }
}
