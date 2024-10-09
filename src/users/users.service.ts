import { BadRequestException, Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import * as argon2 from "argon2";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { ARGON2_OPTIONS } from "@/common/config/argon2.config";
import { EUserRole } from "@/common/enums/roles.enum";

import { CreateUserDto, UpdateUserDto } from "./users.dtos";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private entityManager: EntityManager, private usersRepository: UsersRepository) {}

  private hashPassword(password: string) {
    return argon2.hash(password, ARGON2_OPTIONS);
  }

  async findByIdOrThrow(id: number) {
    const user = await this.usersRepository.findOneOrFail(id);
    return user;
  }

  async findByEmailOrThrow(email: string) {
    const user = await this.usersRepository.findOneOrFail({
      email,
    });
    return user;
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

  async getAllStudents() {
    const users = await this.usersRepository.find(
      { role: EUserRole.STUDENT },
      { populate: ["student"] },
    );

    return users;
  }

  async getUserProfile(user: ITokenizedUser) {
    const userProfile = await this.usersRepository.findOneOrFail(
      { id: user.id },
      { populate: [user.claim === EUserRole.STUDENT ? "student" : "teacher"] },
    );

    return userProfile;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail(id);
    const { firstName, lastName, gender } = updateUserDto;

    this.usersRepository.assign(user, { firstName, lastName, gender });

    if (user.role === EUserRole.TEACHER) {
      const { teacherInput } = updateUserDto;

      this.entityManager.assign(user.teacher, teacherInput);
    } else {
      const { studentInput } = updateUserDto;

      user.student.address = studentInput.address;
      user.student.phoneNumber = studentInput.phoneNumber;
      user.student.educationLevel = studentInput.educationLevel;
      user.student.degree = studentInput.degree || null;
      user.student.degreeName = studentInput.degreeName || null;
      user.student.semesterYear = studentInput.semesterYear || null;
      user.student.medium = studentInput.medium || null;
      user.student.class = studentInput.class || null;
    }

    await this.entityManager.persistAndFlush(user);

    return user;
  }
}
