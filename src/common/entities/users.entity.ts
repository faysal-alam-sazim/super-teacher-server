import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { UsersRepository } from "@/users/users.repository";

import { EUserGender } from "../enums/gender.enum";
import { EUserRole } from "../enums/roles.enum";
import { CustomBaseEntity } from "./custom-base.entity";
import { Student } from "./students.entity";
import { Teacher } from "./teachers.entity";
import { VerifyUsers } from "./verify-users.entity";

@Entity({
  tableName: "users",
  repository: () => UsersRepository,
})
export class User extends CustomBaseEntity {
  [EntityRepositoryType]?: UsersRepository;

  constructor(
    firstName: string,
    lastName: string,
    gender: EUserGender,
    email: string,
    password: string,
    role: EUserRole,
  ) {
    super();

    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ fieldName: "first_name" })
  firstName!: string;

  @Property({ fieldName: "last_name" })
  lastName!: string;

  @Enum(() => EUserGender)
  gender!: EUserGender;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Enum(() => EUserRole)
  role!: EUserRole;

  @OneToOne(() => Student, { mappedBy: (student) => student.user })
  student!: Rel<Student>;

  @OneToOne(() => Teacher, { mappedBy: (teacher) => teacher.user })
  teacher!: Rel<Teacher>;

  @OneToMany(() => VerifyUsers, (verifyUser) => verifyUser.user)
  verifyUser = new Collection<VerifyUsers>(this);
}
