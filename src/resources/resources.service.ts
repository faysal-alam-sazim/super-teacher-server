import { Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import { randomUUID } from "crypto";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { PresignedUrlFile } from "@/file-uploads/file-uploads.dtos";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";

import { AddResourcesDto } from "./resources.dtos";
import { ResourcesRepository } from "./resources.repository";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly classroomsRepository: ClassroomsRepository,
    private readonly em: EntityManager,
  ) {}

  addResources(classroomId: number, addResourcesDto: AddResourcesDto, file: Express.Multer.File) {
    this.em.transactional(async (em) => {
      const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

      const presignedUrlFile = new PresignedUrlFile();
      presignedUrlFile.name = `${randomUUID()}-${new Date().getTime()}-${file.originalname}`;
      presignedUrlFile.type = file.mimetype;

      const { name, signedUrl } = await this.fileUploadsService.getPresignedUrl(presignedUrlFile);

      await this.fileUploadsService.uploadToS3(signedUrl, file);

      const fileUrl = `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET_NAME}//${name}`;

      const resource = this.resourcesRepository.create({
        ...addResourcesDto,
        fileUrl,
        classroom: classroom.id,
      });

      await em.persistAndFlush(resource);
    });
  }
}
