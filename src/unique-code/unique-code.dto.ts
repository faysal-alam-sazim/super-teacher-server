import { IsNumber, IsString } from "class-validator";

export class UniqueCodeDto {
  @IsNumber()
  id!: number;

  @IsString()
  email!: string;

  @IsString()
  code!: string;

  @IsNumber()
  resetCounter!: number;
}
