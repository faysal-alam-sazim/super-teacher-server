import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { UniqueCodeService } from "@/unique-code/unique-code.service";
import { CreateUserDto } from "@/users/users.dtos";

@Injectable()
export class UniqueCodeGuard implements CanActivate {
  constructor(private readonly uniqueCodeService: UniqueCodeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const createUserDto: CreateUserDto = request.body;

    const { isValid, resetCounter, message } = await this.uniqueCodeService.validateCode(
      createUserDto.email,
      createUserDto.teacherInput?.code,
    );

    if (!isValid) {
      throw new UnauthorizedException({
        message: message,
        attemptRemaining: resetCounter,
      });
    }

    return true;
  }
}
