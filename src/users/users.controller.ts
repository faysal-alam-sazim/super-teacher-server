import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { UniqueCodeGuard } from "@/auth/guards/unique-code.guard";
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

  @UseGuards(UniqueCodeGuard)
  @Post("teacher")
  async registerTeacher(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createTeacher(createUserDto);
    return this.usersSerializer.serialize(newUser);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: ITokenizedUser) {
    return user;
  }
}
