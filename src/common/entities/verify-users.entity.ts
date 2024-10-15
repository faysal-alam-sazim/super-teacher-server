import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { VerifyUsersRepository } from "@/verify-users/verify-users.repository";

import { CustomBaseEntity } from "./custom-base.entity";
import { User } from "./users.entity";

@Entity({ tableName: "verify_users", repository: () => VerifyUsersRepository })
export class VerifyUsers extends CustomBaseEntity {
  [EntityRepositoryType]!: VerifyUsersRepository;

  @PrimaryKey({ fieldName: "id" })
  id!: number;

  @Property({ fieldName: "otp" })
  otp!: string;

  @Property({ fieldName: "expires_at" })
  expiresAt!: Date;

  @Property({ fieldName: "is_checked" })
  isChecked: boolean = false;

  @ManyToOne(() => User, { fieldName: "user_id", nullable: true })
  user?: Rel<User>;
}
