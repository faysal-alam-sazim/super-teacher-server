import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateExamDto {
  @IsString()
  title!: string;

  @IsString()
  instruction!: string;

  @IsDate()
  @Type(() => Date)
  date!: Date;
}

export class UpdateExamDto {
  @IsNumber()
  id?: number;

  @IsString()
  title?: string;

  @IsString()
  instruction?: string;

  @IsDate()
  @Type(() => Date)
  date?: Date;
}
