import {
  Entity,
  EntityRepositoryType,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { StudentsRepository } from "@/students/students.repository";

import { EDegree } from "../enums/degree.enum";
import { EStudentEducationLevel } from "../enums/educationLevel.enum";
import { EMedium } from "../enums/medium.enum";
import { CustomBaseEntity } from "./custom-base.entity";
import { User } from "./users.entity";

@Entity({ tableName: "students", repository: () => StudentsRepository })
export class Student extends CustomBaseEntity {
  [EntityRepositoryType]?: StudentsRepository;

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Enum(() => EStudentEducationLevel)
  educationLevel!: EStudentEducationLevel;

  @Enum(() => EMedium)
  medium!: EMedium | null;

  @Property({ nullable: true })
  class!: string | null;

  @Enum(() => EDegree)
  degree!: EDegree | null;

  @Property({ nullable: true })
  degreeName!: string | null;

  @Property({ nullable: true })
  semesterYear!: string | null;

  @OneToOne(() => User)
  user!: Rel<User>;
}
