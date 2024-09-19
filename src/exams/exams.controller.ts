import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { Roles } from "@/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { EUserRole } from "@/common/enums/roles.enum";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { CreateExamDto } from "./exams.dtos";
import { ExamsService } from "./exams.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get(":classroomId/exams")
  getExams(@Param("classroomId", ParseIntPipe) classroomId: number) {
    return this.examsService.getExams(classroomId);
  }

  @Post(":classroomId/exams")
  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  createExam(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Body() createExamDto: CreateExamDto,
  ) {
    return this.examsService.createExam(classroomId, createExamDto);
  }
}
