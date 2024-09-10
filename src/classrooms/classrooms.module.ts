import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { ClassroomStudent } from "@/common/entities/classrooms-students.entity";
import { Classroom } from "@/common/entities/classrooms.entity";
import { Student } from "@/common/entities/students.entity";
import { User } from "@/common/entities/users.entity";
import { MailModule } from "@/mail/mail.module";

import { ClassroomsController } from "./classrooms.controller";
import { ClassroomsSerializer } from "./classrooms.serializer";
import { ClassroomsService } from "./classrooms.service";

@Module({
  imports: [MikroOrmModule.forFeature([Classroom, User, ClassroomStudent, Student]), MailModule],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomsSerializer],
})
export class ClassroomsModule {}
