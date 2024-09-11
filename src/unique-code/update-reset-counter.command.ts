import { EntityManager } from "@mikro-orm/core";

import { randomBytes } from "crypto";
import { Command, CommandRunner, Option } from "nest-commander";

import { UniqueCodeRepository } from "@/unique-code/unique-code.repository";

import { ICommandData } from "./generate-unique-command.types";

@Command({
  name: "reset-code",
  description: "Reset unique code for specific user",
})
export class UpdateResetCounterCommand extends CommandRunner {
  constructor(
    private readonly em: EntityManager,
    private readonly uniqueCodeRepository: UniqueCodeRepository,
  ) {
    super();
  }

  async run(passedParams: string[], options?: ICommandData): Promise<void> {
    const email = options?.email;

    if (!email) {
      console.error("Email is required");
      return;
    }

    try {
      await this.em.transactional(async (em) => {
        const code = randomBytes(3).toString("hex").toUpperCase();

        const uniqueCode = await this.uniqueCodeRepository.findOneOrFail({ email });

        uniqueCode.code = code;
        uniqueCode.resetCounter = 3;

        await em.persistAndFlush(uniqueCode);
      });
    } catch (error) {
      console.error("Error reseting code:", error);
      return;
    }

    console.log(`Code Reset successful for email: ${email}`);
  }

  @Option({
    flags: "-e, --email <email>",
    description: "Email for which the code should be updated",
  })
  parseEmail(val: string): string {
    return val;
  }
}
