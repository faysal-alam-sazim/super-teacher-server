import { Injectable, UnauthorizedException } from "@nestjs/common";

import { EntityManager } from "@mikro-orm/core";

import { UniqueCodeRepository } from "@/unique-code/unique-code.repository";

@Injectable()
export class UniqueCodeService {
  constructor(
    private entityManager: EntityManager,
    private readonly uniqueCodeRepository: UniqueCodeRepository,
  ) {}

  async validateCode(
    email: string,
    code: string,
  ): Promise<{ isValid: boolean; resetCounter?: number; message?: string }> {
    const uniqueCodeRecord = await this.uniqueCodeRepository.findOne({ email });

    if (!uniqueCodeRecord) {
      throw new UnauthorizedException("Invalid email address. Please contact the admin");
    }

    if (uniqueCodeRecord.resetCounter === 0) {
      return {
        isValid: false,
        resetCounter: uniqueCodeRecord.resetCounter,
        message: "Validation attempts exceeded. Please contact the admin",
      };
    }

    if (uniqueCodeRecord.code !== code) {
      uniqueCodeRecord.resetCounter -= 1;
      await this.entityManager.persistAndFlush(uniqueCodeRecord);

      return {
        isValid: false,
        resetCounter: uniqueCodeRecord.resetCounter,
        message: "Invalid registration code. Please try again or contact the admin",
      };
    }

    return { isValid: true };
  }
}
