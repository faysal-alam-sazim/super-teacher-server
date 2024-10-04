import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { ResourcesRepository } from "@/resources/resources.repository";

import { Classroom } from "./classrooms.entity";
import { CustomBaseEntity } from "./custom-base.entity";

@Entity({ tableName: "resources", repository: () => ResourcesRepository })
export class Resource extends CustomBaseEntity {
  [EntityRepositoryType]?: ResourcesRepository;

  @PrimaryKey()
  id!: number;

  @Property({ fieldName: "title" })
  title!: string;

  @Property({ fieldName: "file_url" })
  fileUrl!: string;

  @Property({ fieldName: "description" })
  description!: string;

  @ManyToOne(() => Classroom, { fieldName: "classroom_id", deleteRule: "cascade" })
  classroom!: Rel<Classroom>;
}
