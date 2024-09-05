import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Roles } from "@/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { EUserRole } from "@/common/enums/roles.enum";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { CreateClassroomDto, EnrollStudentDto } from "./classrooms.dto";
import { ClassroomsSerializer } from "./classrooms.serializer";
import { ClassroomsService } from "./classrooms.service";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class ClassroomsController {
  constructor(
    private readonly classroomsService: ClassroomsService,
    private readonly classroomsSerializer: ClassroomsSerializer,
  ) {}

  @Get(":id")
  getClassroom(@Param("id", ParseIntPipe) id: number) {
    return this.classroomsService.getClassroomById(id);
  }

  @Get()
  getClassrooms(@CurrentUser() user: ITokenizedUser) {
    return this.classroomsService.getClassrooms(user.id, user.claim);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  createClassroom(@CurrentUser() user: ITokenizedUser, @Body() classroomDto: CreateClassroomDto) {
    return this.classroomsService.createClassroom(classroomDto, user.id);
  }

  @Post("students")
  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  addStudent(@Body() enrollStudentDto: EnrollStudentDto) {
    return this.classroomsService.addStudent(enrollStudentDto);
  }

  @Delete("students")
  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  removeStudentFromClassroom(
    @CurrentUser() user: ITokenizedUser,
    @Body() deleteEnrollDto: EnrollStudentDto,
  ) {
    return this.classroomsService.removeStudentFromClassroom(user.id, deleteEnrollDto);
  }

  @Get(":id/students")
  async getClassroomStudents(@Param("id", ParseIntPipe) id: number) {
    const students = await this.classroomsService.getClassroomStudents(id);

    return this.classroomsSerializer.serializeMany(students);
  }
}
