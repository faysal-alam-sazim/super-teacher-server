import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { Classroom } from "@/common/entities/classrooms.entity";

@Module({ imports: [MikroOrmModule.forFeature([Classroom])] })
export class ClassroomsModule {}
