import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { Classroom } from "@/common/entities/classrooms.entity";
import { Exam } from "@/common/entities/exams.entity";

import { ExamsController } from "./exams.controller";
import { ExamsService } from "./exams.service";

@Module({
  imports: [MikroOrmModule.forFeature([Exam, Classroom])],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
