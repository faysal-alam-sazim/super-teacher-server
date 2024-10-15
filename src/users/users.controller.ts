import { Body, Controller, Get, Patch, UseGuards, UseInterceptors } from "@nestjs/common";

import { makeTokenizedUser } from "@/auth/auth.helpers";
import { ITokenizedUser } from "@/auth/auth.interfaces";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { ResetPasswordDto, UpdateUserDto, UpdatePasswordDto } from "./users.dtos";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@UseInterceptors(ResponseTransformInterceptor)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersSerializer: UsersSerializer,
  ) {}

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

  @Patch("update-password")
  updateUserPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updateUserPassword(updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("reset-password")
  async resetPassword(
    @CurrentUser() user: ITokenizedUser,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const updateUser = await this.usersService.resetPassword(user.id, resetPasswordDto);
    return this.usersSerializer.serialize(updateUser);
  }
}
