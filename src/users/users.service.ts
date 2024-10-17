import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/postgresql";

import * as argon2 from "argon2";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { ARGON2_OPTIONS } from "@/common/config/argon2.config";
import { User } from "@/common/entities/users.entity";
import { EUserRole } from "@/common/enums/roles.enum";
import { VerifyUsersRepository } from "@/verify-users/verify-users.repository";

import { ResetPasswordDto, UpdateUserDto, UpdatePasswordDto } from "./users.dtos";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    private entityManager: EntityManager,
    private usersRepository: UsersRepository,
    private readonly verifyUserRepository: VerifyUsersRepository,
  ) {}

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

  async isOtpVerified(user: User, otp: string) {
    const verifyUser = await this.verifyUserRepository.findOneOrFail({
      otp: otp,
      user: user,
    });

    if (!verifyUser) {
      return false;
    }
    return verifyUser.isChecked;
  }

  async updateUserPassword(updatePasswordDto: UpdatePasswordDto) {
    const { email, newPassword, otp } = updatePasswordDto;

    const user = await this.usersRepository.findOneOrFail({ email });

    if (!this.isOtpVerified(user, otp)) {
      throw new UnauthorizedException("OTP isn't verified");
    }
    user.password = await this.hashPassword(newPassword);

    await this.usersRepository.getEntityManager().persistAndFlush(user);
  }

  async resetPassword(userId: number, resetPasswordDto: ResetPasswordDto) {
    const { oldPassword, newPassword } = resetPasswordDto;

    try {
      const user = await this.usersRepository.findOneOrFail({ id: userId });

      const verified = await argon2.verify(user.password as string, oldPassword, ARGON2_OPTIONS);

      if (verified) {
        user.password = await this.hashPassword(newPassword);
        await this.usersRepository.getEntityManager().persistAndFlush(user);

        return user;
      } else {
        throw new BadRequestException("Old password didn't match!");
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
