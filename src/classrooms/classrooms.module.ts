import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { Classroom } from "@/common/entities/classrooms.entity";
import { User } from "@/common/entities/users.entity";

import { ClassroomsController } from "./classrooms.controller";
import { ClassroomsService } from "./classrooms.service";

@Module({
  imports: [MikroOrmModule.forFeature([Classroom, User])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
})
export class ClassroomsModule {}
