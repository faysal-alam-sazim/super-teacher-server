import { IsString } from "class-validator";

export class VerifyEmailDto {
  @IsString()
  email!: string;
}

export class VerifyOtpDto {
  @IsString()
  email!: string;

  @IsString()
  otp!: string;
}
