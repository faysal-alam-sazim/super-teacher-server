import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

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
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}
