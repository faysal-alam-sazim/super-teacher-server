import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { AuthModule } from "@/auth/auth.module";
import { User } from "@/common/entities/users.entity";
import { VerifyUsers } from "@/common/entities/verify-users.entity";
import { UniqueCodeModule } from "@/unique-code/unique-code.module";

import { UsersController } from "./users.controller";
import { UsersSerializer } from "./users.serializer";
import { UsersService } from "./users.service";

@Module({
  imports: [AuthModule, UniqueCodeModule, MikroOrmModule.forFeature([User, VerifyUsers])],
  controllers: [UsersController],
  providers: [UsersService, UsersSerializer],
  exports: [UsersService, UsersSerializer, MikroOrmModule.forFeature([User])],
})
export class UsersModule {}
