import { Logger, Injectable } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/core";

import { randomBytes } from "crypto";
import { Command, CommandRunner, Option } from "nest-commander";

import { UniqueCodeRepository } from "@/unique-code/unique-code.repository";

import { ICommandData } from "./generate-unique-command.types";

@Command({
  name: "generate-unique-code",
  description: "Generates a unique code for a user and saves it to the database",
})
@Injectable()
export class GenerateUniqueCodeCommand extends CommandRunner {
  private readonly logger = new Logger(GenerateUniqueCodeCommand.name);

  constructor(
    private readonly em: EntityManager,
    private readonly uniqueCodeRepository: UniqueCodeRepository,
  ) {
    super();
  }

  async run(passedParams: string[], options?: ICommandData): Promise<void> {
    const email = options?.email;
    const resetCounter = 3;

    if (!email) {
      this.logger.error("Email is required");
      return;
    }

    try {
      await this.em.transactional(async (em) => {
        const code = randomBytes(3).toString("hex").toUpperCase();
        const uniqueCode = this.uniqueCodeRepository.create({
          email,
          code,
          resetCounter,
        });

        await em.persistAndFlush(uniqueCode);
      });
      this.logger.log(`Unique code generated for email: ${email}`);
    } catch (UniqueConstraintViolationException) {
      this.logger.error("User already exists");
    }
  }

  @Option({
    flags: "-e, --email <email>",
    description: "Email for which the unique code should be generated",
  })
  parseEmail(val: string): string {
    return val;
  }
}
