import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
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

import { AddAssignmentDto } from "./assignments.dtos";
import { AssignmentsService } from "./assignments.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  @UseInterceptors(FileInterceptor("file"))
  @Post(":classroomId/assignments")
  addAssignemnt(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Body() addAssignmentDto: AddAssignmentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assignmentsService.addAssignment(classroomId, addAssignmentDto, file);
  }
}
