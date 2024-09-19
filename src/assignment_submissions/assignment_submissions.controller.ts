import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Roles } from "@/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { EUserRole } from "@/common/enums/roles.enum";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { AssignmentSubmissionSerializer } from "./assignment_submissions.serializer";
import { AssignmentSubmissionsService } from "./assignment_submissions.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms/:classroomId/assignments")
export class AssignmentSubmissionsController {
  constructor(
    private readonly assignmentSubmissionsService: AssignmentSubmissionsService,
    private readonly assignmentSubmissionsSerializer: AssignmentSubmissionSerializer,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  @Get(":assignmentId/submissions")
  async getAssignmentSubmissions(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Param("assignmentId", ParseIntPipe) assignmentId: number,
  ) {
    const submissions = await this.assignmentSubmissionsService.getAssignmentSubmissions(
      classroomId,
      assignmentId,
    );
    return this.assignmentSubmissionsSerializer.serializeMany(submissions);
  }

  @UseGuards(RolesGuard)
  @Roles(EUserRole.STUDENT)
  @UseInterceptors(FileInterceptor("file"))
  @Post(":assignmentId/submissions")
  addSubmission(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Param("assignmentId", ParseIntPipe) assignmentId: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: ITokenizedUser,
  ) {
    return this.assignmentSubmissionsService.addSubmission(
      classroomId,
      assignmentId,
      file,
      user.id,
    );
  }
}
