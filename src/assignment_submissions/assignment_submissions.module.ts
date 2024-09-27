import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { AssignmentSubmission } from "@/common/entities/assignment-submissions.entity";
import { Assignment } from "@/common/entities/assignments.entity";
import { Classroom } from "@/common/entities/classrooms.entity";
import { Student } from "@/common/entities/students.entity";
import { FileUploadsModule } from "@/file-uploads/file-uploads.module";

import { AssignmentSubmissionsController } from "./assignment_submissions.controller";
import { AssignmentSubmissionsService } from "./assignment_submissions.service";

@Module({
  imports: [
    FileUploadsModule,
    MikroOrmModule.forFeature([AssignmentSubmission, Student, Assignment, Classroom]),
  ],
  controllers: [AssignmentSubmissionsController],
  providers: [AssignmentSubmissionsService],
})
export class AssignmentSubmissionsModule {}
