import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";

import { User } from "@/common/entities/users.entity";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { CreateUserDto, LoginResponseDto } from "./auth.dtos";
import { makeTokenizedUser } from "./auth.helpers";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { UniqueCodeGuard } from "./guards/unique-code.guard";

@UseInterceptors(ResponseTransformInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(UniqueCodeGuard)
  @Post("signup")
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.createUser(createUserDto);

    const accessToken = await this.authService.createAccessToken(newUser);

    return {
      accessToken,
      user: makeTokenizedUser(newUser),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() user: User): Promise<LoginResponseDto> {
    const accessToken = await this.authService.createAccessToken(user);

    return {
      accessToken,
      user: makeTokenizedUser(user),
    };
  }
}
