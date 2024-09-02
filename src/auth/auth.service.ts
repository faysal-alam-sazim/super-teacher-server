import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";

import { ARGON2_OPTIONS } from "@/common/config/argon2.config";
import { User } from "@/common/entities/users.entity";
import { UsersRepository } from "@/users/users.repository";

import { INVALID_USER_CREDENTIALS } from "./auth.constants";
import { IJwtPayload } from "./auth.interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOneOrFail({ email });

    const verified = await argon2.verify(user.password as string, password, ARGON2_OPTIONS);
    if (!verified) throw new UnauthorizedException(INVALID_USER_CREDENTIALS);

    return user;
  }

  checkUserExists(id: number) {
    return this.usersRepository.findOneOrFail(id);
  }

  async createAccessToken(loggedInUser: User): Promise<string> {
    const user = await this.usersRepository.findOneOrFail({
      email: loggedInUser.email,
    });

    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
