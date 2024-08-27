import { Module } from "@nestjs/common";

import { MikroOrmModule } from "@mikro-orm/nestjs";

import { UniqueCode } from "@/common/entities/unique-code.entity";

import { GenerateUniqueCodeCommand } from "./generate-unique-code.command";
import { UniqueCodeService } from "./unique-code.service";
import { UpdateResetCounterCommand } from "./update-reset-counter.command";

@Module({
  imports: [MikroOrmModule.forFeature([UniqueCode])],
  providers: [UniqueCodeService, GenerateUniqueCodeCommand, UpdateResetCounterCommand],
  exports: [UniqueCodeService, MikroOrmModule.forFeature([UniqueCode])],
})
export class UniqueCodeModule {}
