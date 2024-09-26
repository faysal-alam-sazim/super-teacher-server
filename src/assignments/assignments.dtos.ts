import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class AddAssignmentDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsDate()
  @Type(() => Date)
  dueDate!: Date;
}
