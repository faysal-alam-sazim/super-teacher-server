import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { EUserRole } from "@/common/enums/roles.enum";
import { UniqueCodeService } from "@/unique-code/unique-code.service";

import { CreateUserDto } from "../auth.dtos";

@Injectable()
export class UniqueCodeGuard implements CanActivate {
  constructor(private readonly uniqueCodeService: UniqueCodeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const createUserDto: CreateUserDto = request.body;

    if (createUserDto.role !== EUserRole.TEACHER) return true;

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
