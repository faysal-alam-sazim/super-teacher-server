import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";

import { ARGON2_OPTIONS } from "@/common/config/argon2.config";
import { User } from "@/common/entities/users.entity";
import { EUserRole } from "@/common/enums/roles.enum";
import { UsersRepository } from "@/users/users.repository";

import { INVALID_USER_CREDENTIALS } from "./auth.constants";
import { CreateUserDto } from "./auth.dtos";
import { IJwtPayload } from "./auth.interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  private hashPassword(password: string) {
    return argon2.hash(password, ARGON2_OPTIONS);
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({ email: createUserDto.email });
    let newUser;

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    if (createUserDto.role === EUserRole.TEACHER) {
      newUser = this.usersRepository.createTeacher({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      });
    } else {
      newUser = this.usersRepository.createStudent({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      });
    }

    return newUser;
  }

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
