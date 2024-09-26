import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { ClassroomsModule } from "@/classrooms/classrooms.module";
import { Classroom } from "@/common/entities/classrooms.entity";
import { Exam } from "@/common/entities/exams.entity";
import { MailModule } from "@/mail/mail.module";

import { ExamsController } from "./exams.controller";
import { ExamsService } from "./exams.service";

@Module({
  imports: [MikroOrmModule.forFeature([Classroom, Exam]), MailModule, ClassroomsModule],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
