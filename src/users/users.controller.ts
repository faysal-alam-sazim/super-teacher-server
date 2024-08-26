import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";

import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { CreateUserDto } from "./users.dtos";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@UseInterceptors(ResponseTransformInterceptor)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersSerializer: UsersSerializer,
  ) {}

  @Post("student")
  async registerStudent(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createStudent(createUserDto);
    return this.usersSerializer.serialize(newUser);
  }

  @Post("teacher")
  async registerTeacher(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createTeacher(createUserDto);
    return this.usersSerializer.serialize(newUser);
  }
}
