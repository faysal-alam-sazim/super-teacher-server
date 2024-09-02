import { EntityManager } from "@mikro-orm/core";

import { Command, CommandRunner, Option } from "nest-commander";

import { UniqueCodeRepository } from "@/unique-code/unique-code.repository";

import { ICommandData } from "./generate-unique-command.types";

@Command({
  name: "update-reset-counter",
  description: "Updates the resetCounter value to 3 for a specific user",
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
        const uniqueCode = await this.uniqueCodeRepository.findOneOrFail({ email });

        uniqueCode.resetCounter = 3;

        await em.persistAndFlush(uniqueCode);
      });
    } catch (error) {
      console.error("Error updating resetCounter:", error);
      return;
    }

    console.log(`Reset counter updated to 3 for email: ${email}`);
  }

  @Option({
    flags: "-e, --email <email>",
    description: "Email for which the resetCounter should be updated",
  })
  parseEmail(val: string): string {
    return val;
  }
}
