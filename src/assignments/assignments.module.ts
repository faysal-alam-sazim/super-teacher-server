import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { AssignmentSubmission } from "@/common/entities/assignment-submissions.entity";
import { Assignment } from "@/common/entities/assignments.entity";
import { Classroom } from "@/common/entities/classrooms.entity";
import { Student } from "@/common/entities/students.entity";
import { FileUploadsModule } from "@/file-uploads/file-uploads.module";

import { AssignmentsController } from "./assignments.controller";
import { AssignmentsSerializer } from "./assignments.serializer";
import { AssignmentsService } from "./assignments.service";

@Module({
  imports: [
    FileUploadsModule,
    MikroOrmModule.forFeature([Classroom, Assignment, Student, AssignmentSubmission]),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsSerializer],
})
export class AssignmentsModule {}
