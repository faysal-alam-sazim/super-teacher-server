import { Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString } from "class-validator";

export class CreateClassroomDto {
  @IsString()
  title!: string;

  @IsString()
  subject!: string;

  @IsDate()
  @Type(() => Date)
  classTime!: Date;

  @IsArray()
  days!: Array<string>;

  @IsOptional()
  @IsString()
  meetLink?: string;
}
