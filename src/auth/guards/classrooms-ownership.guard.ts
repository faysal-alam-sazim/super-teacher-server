import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

import { ClassroomsRepository } from "@/classrooms/classrooms.repository";
import { UsersRepository } from "@/users/users.repository";

import { ITokenizedUser } from "../auth.interfaces";

@Injectable()
export class ClassroomOwnershipGuard implements CanActivate {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly classroomsRepository: ClassroomsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: ITokenizedUser = request.user;
    const classroomId = request.params.classroomId;

    const userFromDb = await this.usersRepository.findOneOrFail({ id: user.id });

    const classroom = await this.classroomsRepository.findOneOrFail({
      id: classroomId,
      teacher: userFromDb.teacher.id,
    });

    if (!classroom) {
      throw new ForbiddenException("You do not have permission to modify this classroom.");
    }

    return true;
  }
}
