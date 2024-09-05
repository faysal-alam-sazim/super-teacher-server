import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(recieverAddress: string, subject: string, body: string) {
    const sentMailInfo = await this.mailerService.sendMail({
      to: recieverAddress,
      subject: subject,
      text: body,
    });

    return sentMailInfo;
  }
}
