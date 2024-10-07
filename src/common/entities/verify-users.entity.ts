import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { VerifyUsersRepository } from "@/verify-users/verify-users.repository";

import { EVerifyUserStatus } from "../enums/verifyUsersStatus.enum";
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

  @Enum({ items: () => EVerifyUserStatus, fieldName: "status" })
  status!: EVerifyUserStatus;

  @Property({ fieldName: "is_checked" })
  isChecked: boolean = false;

  @ManyToOne(() => User, { fieldName: "user_id", nullable: true })
  user?: Rel<User>;
}
