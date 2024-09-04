import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Roles } from "@/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { EUserRole } from "@/common/enums/roles.enum";

import { CreateClassroomDto, EnrollStudentDto } from "./classrooms.dto";
import { ClassroomsService } from "./classrooms.service";

@UseGuards(JwtAuthGuard)
@Controller("classrooms")
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

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

  @Post("enroll")
  @UseGuards(RolesGuard)
  @Roles(EUserRole.TEACHER)
  addStudent(@Body() enrollStudentDto: EnrollStudentDto) {
    return this.classroomsService.addStudent(enrollStudentDto);
  }
}
