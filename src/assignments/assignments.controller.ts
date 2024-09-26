import {
  Body,
  Controller,
  Delete,
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

import { AddAssignmentDto, UpdateAssignmentDto } from "./assignments.dtos";
import { AssignmentsSerializer } from "./assignments.serializer";
import { AssignmentsService } from "./assignments.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly assignmentsSerializer: AssignmentsSerializer,
  ) {}

  @Get(":classroomId/assignments")
  async getAssignments(@Param("classroomId", ParseIntPipe) classroomId: number) {
    const assignments = await this.assignmentsService.getAssignments(classroomId);
    return this.assignmentsSerializer.serializeMany(assignments);
  }

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

  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  @UseInterceptors(FileInterceptor("file"))
  @Patch(":classroomId/assignments/:assignmentId")
  updateAssignment(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Param("assignmentId", ParseIntPipe) assignmentId: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.assignmentsService.updateAssignment(
      classroomId,
      assignmentId,
      updateAssignmentDto,
      file,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  @Delete(":classroomId/assignments/:assignmentId")
  deleteAssignment(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Param("assignmentId", ParseIntPipe) assignmentId: number,
  ) {
    return this.assignmentsService.deleteAssignment(classroomId, assignmentId);
  }
}
