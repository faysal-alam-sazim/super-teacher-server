import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { ClassroomsModule } from "@/classrooms/classrooms.module";
import { Assignment } from "@/common/entities/assignments.entity";
import { Classroom } from "@/common/entities/classrooms.entity";
import { FileUploadsModule } from "@/file-uploads/file-uploads.module";
import { MailModule } from "@/mail/mail.module";

import { AssignmentsController } from "./assignments.controller";
import { AssignmentsSerializer } from "./assignments.serializer";
import { AssignmentsService } from "./assignments.service";

@Module({
  imports: [
    FileUploadsModule,
    MikroOrmModule.forFeature([Classroom, Assignment]),
    ClassroomsModule,
    MailModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsSerializer],
})
export class AssignmentsModule {}
