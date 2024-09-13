import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { ExamsRepository } from "@/exams/exams.repository";

import { Classroom } from "./classrooms.entity";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({ tableName: "exams", repository: () => ExamsRepository })
export class Exam extends CustomBaseEntity {
  [EntityRepositoryType]?: ExamsRepository;

  @PrimaryKey()
  id!: number;

  @Property({ fieldName: "title" })
  title!: string;

  @Property({ fieldName: "instruction" })
  instruction!: string;

  @Property({ fieldName: "date" })
  date!: Date;

  @ManyToOne(() => Classroom, { fieldName: "classroom_id" })
  classroom!: Rel<Classroom>;
}
