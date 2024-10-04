import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Rel } from "@mikro-orm/core";

import { ClassroomsStudentsRepository } from "@/classrooms-students/classrooms-students.repository";

import { Classroom } from "./classrooms.entity";
import { CustomBaseEntity } from "./custom-base.entity";
import { Student } from "./students.entity";

@Entity({ tableName: "classroom_student", repository: () => ClassroomsStudentsRepository })
export class ClassroomStudent extends CustomBaseEntity {
  [EntityRepositoryType]?: ClassroomsStudentsRepository;

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Classroom, { fieldName: "classroom_id", deleteRule: "cascade" })
  classroomId!: Rel<Classroom>;

  @ManyToOne(() => Student, { fieldName: "student_id" })
  studentId!: Rel<Student>;
}
