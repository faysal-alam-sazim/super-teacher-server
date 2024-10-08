import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";

import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

import { VerifyEmailDto } from "./verify-users.dtos";
import { VerifyUsersService } from "./verify-users.service";

@UseInterceptors(ResponseTransformInterceptor)
@Controller("verify-users")
export class VerifyUsersController {
  constructor(private readonly verifyUsersService: VerifyUsersService) {}

  @Post("email")
  verifyEmail(@Body() verifyEMailDto: VerifyEmailDto) {
    this.verifyUsersService.verifyUserAndSendOtp(verifyEMailDto.email);
  }
}
