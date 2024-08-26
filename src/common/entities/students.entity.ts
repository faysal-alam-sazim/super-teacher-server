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

  constructor(
    address: string,
    phoneNumber: string,
    educationLevel: EStudentEducationLevel,
    medium: EMedium,
    className: string,
    degree: EDegree,
    degreeName: string,
    semesterYear: string,
  ) {
    super();

    this.address = address;
    this.phoneNumber = phoneNumber;
    this.educationLevel = educationLevel;
    this.medium = medium || null;
    this.class = className || null;
    this.degree = degree || null;
    this.degreeName = degreeName || null;
    this.semesterYear = semesterYear || null;
  }

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property()
  address!: string;

  @Property({ fieldName: "phone_number" })
  phoneNumber!: string;

  @Enum(() => EStudentEducationLevel)
  educationLevel!: EStudentEducationLevel;

  @Enum(() => EMedium)
  medium!: EMedium | null;

  @Enum(() => EDegree)
  degree!: EDegree | null;

  @Property({ nullable: true })
  class!: string | null;

  @Property({ nullable: true })
  degreeName!: string | null;

  @Property({ nullable: true })
  semesterYear!: string | null;

  @OneToOne(() => User)
  user!: Rel<User>;
}
