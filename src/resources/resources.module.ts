import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { ClassroomsModule } from "@/classrooms/classrooms.module";
import { Classroom } from "@/common/entities/classrooms.entity";
import { Resource } from "@/common/entities/resources.entity";
import { FileUploadsModule } from "@/file-uploads/file-uploads.module";
import { MailModule } from "@/mail/mail.module";

import { ResourcesController } from "./resources.controller";
import { ResourcesService } from "./resources.service";

@Module({
  imports: [
    FileUploadsModule,
    MikroOrmModule.forFeature([Classroom, Resource]),
    ClassroomsModule,
    MailModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
