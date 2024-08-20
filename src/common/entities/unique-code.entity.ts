import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core";

import { UniqueCodeRepository } from "@/unique-code/unique-code.repository";

import { CustomBaseEntity } from "./custom-base.entity";

@Entity({ tableName: "unique_code", repository: () => UniqueCodeRepository })
export class UniqueCode extends CustomBaseEntity {
  [EntityRepositoryType]?: UniqueCodeRepository;

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property({ unique: true, fieldName: "code" })
  code!: string;

  @Property({ fieldName: "reset_counter" })
  resetCounter!: number;
}
