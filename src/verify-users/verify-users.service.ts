import { BadRequestException, Injectable } from "@nestjs/common";

import dayjs from "dayjs";

import { EVerifyUserStatus } from "@/common/enums/verifyUsersStatus.enum";
import { MailService } from "@/mail/mail.service";
import { UsersRepository } from "@/users/users.repository";

import { VerifyUsersRepository } from "./verify-users.repository";

@Injectable()
export class VerifyUsersService {
  constructor(
    private readonly verifyUsersRepository: VerifyUsersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  async verifyUserAndSendOtp(email: string) {
    const user = await this.usersRepository.findOneOrFail({ email });

    if (!user) {
      throw new BadRequestException("Can't find the email");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = dayjs().add(5, "minute").toDate();

    const verifyUser = this.verifyUsersRepository.create({
      otp,
      expiresAt,
      status: EVerifyUserStatus.ACTIVE,
      isChecked: false,
      user,
    });

    await this.verifyUsersRepository.getEntityManager().persistAndFlush(verifyUser);
    await this.sendEmailWithOtp(email, otp);
  }

  async sendEmailWithOtp(email: string, otp: string) {
    await this.mailService.sendMail(
      email,
      "Verify User OTP",
      `Your OTP is ${otp}. It will expires after 5 minutes.`,
    );
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.usersRepository.findOneOrFail({ email: email });
    const verifyUser = await this.verifyUsersRepository.findOneOrFail({ otp: otp, user: user });

    if (!verifyUser) {
      throw new BadRequestException("Otp didn't match. Please try again");
    }

    if (verifyUser.expiresAt < new Date()) {
      throw new BadRequestException("Otp is expired. Please try again.");
    }

    verifyUser.isChecked = true;

    await this.verifyUsersRepository.getEntityManager().persistAndFlush(verifyUser);

    return verifyUser;
  }
}
