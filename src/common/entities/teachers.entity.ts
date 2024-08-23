import { Entity, EntityRepositoryType, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";

import { TeachersRepository } from "@/teachers/teachers.repository";

import { CustomBaseEntity } from "./custom-base.entity";
import { User } from "./users.entity";

@Entity({ tableName: "teachers", repository: () => TeachersRepository })
export class Teacher extends CustomBaseEntity {
  [EntityRepositoryType]?: TeachersRepository;

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ fieldName: "highest_education_level" })
  highestEducationLevel!: string;

  @Property({ fieldName: "major_subject" })
  majorSubject!: string;

  @Property({ fieldName: "subjects_to_teach" })
  subjectsToTeach!: Array<string>;

  @OneToOne(() => User)
  user!: Rel<User>;
}
