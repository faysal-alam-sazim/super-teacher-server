import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { MessagesRepository } from "@/messages/messages.repository";

import { Classroom } from "./classrooms.entity";
import { CustomBaseEntity } from "./custom-base.entity";
import { User } from "./users.entity";

@Entity({ tableName: "message", repository: () => MessagesRepository })
export class Message extends CustomBaseEntity {
  [EntityRepositoryType]?: MessagesRepository;

  @PrimaryKey()
  id!: number;

  @Property({ fieldName: "message" })
  message!: string;

  @Property({ fieldName: "attachment_url", nullable: true })
  attachmentUrl?: string;

  @ManyToOne(() => User)
  sender!: Rel<User>;

  @ManyToOne(() => Classroom, { deleteRule: "cascade" })
  classroom!: Rel<Classroom>;
}
