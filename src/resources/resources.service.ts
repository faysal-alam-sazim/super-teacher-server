import { Injectable } from "@nestjs/common";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { FileUploadsService } from "@/file-uploads/file-uploads.service";

import { AddResourcesDto, UpdateResourceDto } from "./resources.dtos";
import { ResourcesRepository } from "./resources.repository";

@Injectable()
export class ResourcesService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly fileUploadsService: FileUploadsService,
    private readonly classroomsRepository: ClassroomsRepository,
  ) {}

  async getResources(classroomId: number) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const resources = await this.resourcesRepository.find(
      { classroom: classroom.id },
      { orderBy: { createdAt: "ASC" } },
    );

    return resources;
  }

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

  async updateResource(
    classroomId: number,
    resourceId: number,
    updateResourcesDto: UpdateResourceDto,
    newFile?: Express.Multer.File,
  ) {
    const classroom = await this.classroomsRepository.findOneOrFail({ id: classroomId });

    const resource = await this.resourcesRepository.findOneOrFail({
      id: resourceId,
      classroom: classroom.id,
    });

    if (newFile) {
      const prevFileKey = resource.fileUrl.split("project-dev-bucket/")[1];
      await this.fileUploadsService.deleteFromS3(prevFileKey);

      updateResourcesDto.fileUrl = await this.fileUploadsService.handleFileUpload(newFile);
    }

    return this.resourcesRepository.updateOne(resource, updateResourcesDto);
  }
}
