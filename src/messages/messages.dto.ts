import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsNumber()
  sender!: number;
}
