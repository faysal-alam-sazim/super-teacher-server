import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Roles } from "@/auth/decorators/roles.decorator";
import { ClassroomOwnershipGuard } from "@/auth/guards/classrooms-ownership.guard";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { EUserRole } from "@/common/enums/roles.enum";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { CreateClassroomDto, EnrollStudentDto, UpdateClassroomDto } from "./classrooms.dtos";
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
  async getClassroom(@Param("id", ParseIntPipe) id: number) {
    const classroom = await this.classroomsService.getClassroomById(id);
    return this.classroomsSerializer.serialize(classroom);
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

  @Post(":id/students")
  @UseGuards(RolesGuard, ClassroomOwnershipGuard)
  @Roles(EUserRole.TEACHER)
  addStudent(@Param("id", ParseIntPipe) id: number, @Body() enrollStudentDto: EnrollStudentDto) {
    return this.classroomsService.addStudent(id, enrollStudentDto.studentId);
  }

  @Delete(":id/students")
  @UseGuards(RolesGuard, ClassroomOwnershipGuard)
  @Roles(EUserRole.TEACHER)
  removeStudentFromClassroom(
    @Param("id", ParseIntPipe) id: number,
    @Body() deleteEnrollDto: EnrollStudentDto,
  ) {
    return this.classroomsService.removeStudentFromClassroom(id, deleteEnrollDto.studentId);
  }

  @Get(":id/students")
  async getClassroomStudents(@Param("id", ParseIntPipe) id: number) {
    const students = await this.classroomsService.getClassroomStudents(id);

    return this.classroomsSerializer.serializeMany(students);
  }

  @UseGuards(RolesGuard, ClassroomOwnershipGuard)
  @Roles(EUserRole.TEACHER)
  @Patch("/:classroomId")
  updateClassroom(
    @Param("classroomId", ParseIntPipe) classroomId: number,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.updateClassroom(classroomId, updateClassroomDto);
  }

  @UseGuards(RolesGuard, ClassroomOwnershipGuard)
  @Roles(EUserRole.TEACHER)
  @Delete("/:classroomId")
  deleteClassroom(@Param("classroomId", ParseIntPipe) classroomId: number) {
    return this.classroomsService.deleteClassroom(classroomId);
  }
}
