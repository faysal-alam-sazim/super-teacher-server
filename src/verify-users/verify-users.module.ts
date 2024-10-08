import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { User } from "@/common/entities/users.entity";
import { VerifyUsers } from "@/common/entities/verify-users.entity";
import { MailModule } from "@/mail/mail.module";

import { VerifyUsersController } from "./verify-users.controller";
import { VerifyUsersService } from "./verify-users.service";

@Module({
  imports: [MailModule, MikroOrmModule.forFeature([User, VerifyUsers])],
  controllers: [VerifyUsersController],
  providers: [VerifyUsersService],
})
export class VerifyUsersModule {}
