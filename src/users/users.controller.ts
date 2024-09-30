import { Body, Controller, Get, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";

import { makeTokenizedUser } from "@/auth/auth.helpers";
import { ITokenizedUser } from "@/auth/auth.interfaces";
import { AuthService } from "@/auth/auth.service";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { UniqueCodeGuard } from "@/auth/guards/unique-code.guard";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { CreateUserDto, UpdateUserDto } from "./users.dtos";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@UseInterceptors(ResponseTransformInterceptor)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly usersSerializer: UsersSerializer,
  ) {}
  @UseGuards(UniqueCodeGuard)
  @Post("signup")
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);

    const accessToken = await this.authService.createAccessToken(newUser);

    return {
      accessToken,
      user: makeTokenizedUser(newUser),
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: ITokenizedUser) {
    return user;
  }

  @Get("students")
  async getAllStudents() {
    const users = await this.usersService.getAllStudents();

    return this.usersSerializer.serializeMany(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getUserProfile(@CurrentUser() user: ITokenizedUser) {
    const userProfile = await this.usersService.getUserProfile(user);

    return this.usersSerializer.serialize(userProfile);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  async updateUser(@CurrentUser() user: ITokenizedUser, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(user.id, updateUserDto);

    return makeTokenizedUser(updatedUser);
  }
}
