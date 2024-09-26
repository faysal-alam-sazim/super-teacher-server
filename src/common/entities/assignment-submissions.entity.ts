import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core";

import { AssignmentSubmissionsRepository } from "@/assignment_submissions/assignment_submissions.repository";

import { Assignment } from "./assignments.entity";
import { CustomBaseEntity } from "./custom-base.entity";
import { Student } from "./students.entity";

@Entity({ tableName: "assignment_submissions", repository: () => AssignmentSubmissionsRepository })
export class AssignmentSubmission extends CustomBaseEntity {
  [EntityRepositoryType]?: AssignmentSubmissionsRepository;

  @PrimaryKey()
  id!: number;

  @Property({ fieldName: "submitted_at" })
  submittedAt!: Date;

  @Property({ fieldName: "file_url" })
  fileUrl!: string;

  @ManyToOne(() => Assignment, { fieldName: "assignment_id", entity: () => Assignment })
  assignment!: Rel<Assignment>;

  @ManyToOne(() => Student, { fieldName: "student_id" })
  student!: Rel<Student>;
}
