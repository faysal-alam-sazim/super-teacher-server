import { Controller, UseGuards, UseInterceptors } from "@nestjs/common";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { ResponseTransformInterceptor } from "@/common/interceptors/response-transform.interceptor";

@UseInterceptors(ResponseTransformInterceptor)
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor() {}
}
