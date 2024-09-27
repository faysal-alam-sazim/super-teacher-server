import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsNumber()
  @Type(() => Number)
  sender!: number;
}
