import { Injectable } from "@nestjs/common";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";

import { AddResourcesDto } from "./resources.dtos";
import { ResourcesRepository } from "./resources.repository";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly classroomsRepository: ClassroomsRepository,
  ) {}

  async addResources(
    classroomId: number,
    addResourcesDto: AddResourcesDto,
    file: Express.Multer.File,
  ) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const fileUrl = await this.fileUploadsService.handleFileUpload(file);

    const resource = this.resourcesRepository.create({
      ...addResourcesDto,
      fileUrl,
      classroom: classroom.id,
    });

    await this.resourcesRepository.getEntityManager().persistAndFlush(resource);
  }
}
