import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class AddAssignmentDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsDate()
  @Type(() => Date)
  dueDate!: Date;
}

export class UpdateAssignmentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
