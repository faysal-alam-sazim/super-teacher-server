import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { UniqueCode } from "@/common/entities/unique-code.entity";

import { UniqueCodeService } from "./unique-code.service";

@Module({
  imports: [MikroOrmModule.forFeature([UniqueCode])],
  providers: [UniqueCodeService],
  exports: [UniqueCodeService, MikroOrmModule.forFeature([UniqueCode])],
})
export class UniqueCodeModule {}
