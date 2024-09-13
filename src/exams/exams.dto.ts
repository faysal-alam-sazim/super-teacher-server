import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateExamDto {
  @IsString()
  title!: string;

  @IsString()
  instruction!: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date!: Date;
}

export class UpdateExamDto extends CreateExamDto {
  @IsNumber()
  id!: number;
}
