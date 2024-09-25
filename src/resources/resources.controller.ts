import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Roles } from "@/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { EUserRole } from "@/common/enums/roles.enum";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { AddResourcesDto, UpdateResourceDto } from "./resources.dtos";
import { ResourcesService } from "./resources.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get(":classroomId/resources")
  getResources(@Param("classroomId", ParseIntPipe) classroomId: number) {
    return this.resourcesService.getResources(classroomId);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  @UseInterceptors(FileInterceptor("file"))
  @Post(":classroomId/resources")
  addResource(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Body() addResourcesDto: AddResourcesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resourcesService.addResources(classroomId, addResourcesDto, file);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  @UseInterceptors(FileInterceptor("file"))
  @Patch(":classroomId/resources/:resourceId")
  updateResource(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Body() updateResourcesDto: UpdateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resourcesService.updateResource(classroomId, resourceId, updateResourcesDto, file);
  }
}
