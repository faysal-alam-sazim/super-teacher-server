import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsObject, IsString, MinLength } from "class-validator";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { EDegree } from "@/common/enums/degree.enum";
import { EStudentEducationLevel } from "@/common/enums/educationLevel.enum";
import { EUserGender } from "@/common/enums/gender.enum";
import { EMedium } from "@/common/enums/medium.enum";
import { EUserRole } from "@/common/enums/roles.enum";

export class CreateStudentDto {
  @IsString()
  address!: string;

  @IsString()
  phoneNumber!: string;

  @IsEnum(EStudentEducationLevel)
  educationLevel!: EStudentEducationLevel;

  @IsEnum(EMedium)
  medium!: EMedium;

  @IsString()
  class!: string;

  @IsEnum(EDegree)
  degree!: EDegree;

  @IsString()
  degreeName!: string;

  @IsString()
  semesterYear!: string;
}

export class CreateUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEnum(EUserGender)
  gender!: EUserGender;

  @IsEnum(EUserRole)
  role!: EUserRole;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsObject()
  @Type(() => CreateStudentDto)
  studentInput!: CreateStudentDto;
}

export class TokenizedUser implements ITokenizedUser {
  id!: number;
  claimId!: number;
  claim!: EUserRole;
  userProfileId!: number;
  email!: string;
}
