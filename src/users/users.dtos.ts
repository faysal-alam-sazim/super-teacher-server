import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

import { ITokenizedUser } from "@/auth/auth.interfaces";
import { EDegree } from "@/common/enums/degree.enum";
import { EStudentEducationLevel } from "@/common/enums/educationLevel.enum";
import { EUserGender } from "@/common/enums/gender.enum";
import { EHighestEducationLevel } from "@/common/enums/highestEducationLevel.enum";
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

export class CreateTeacherDto {
  @IsString()
  code!: string;

  @IsString()
  majorSubject!: string;

  @IsEnum(EHighestEducationLevel)
  highestEducationLevel!: EHighestEducationLevel;

  @IsArray()
  subjectsToTeach!: Array<string>;
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

  @IsOptional()
  @ValidateIf((o) => o.role === EUserRole.STUDENT)
  @IsObject()
  @Type(() => CreateStudentDto)
  studentInput!: CreateStudentDto;

  @IsOptional()
  @ValidateIf((o) => o.role === EUserRole.TEACHER)
  @IsObject()
  @Type(() => CreateTeacherDto)
  teacherInput!: CreateTeacherDto;
}

export class TokenizedUser implements ITokenizedUser {
  id!: number;
  claimId!: number;
  claim!: EUserRole;
  userProfileId!: number;
  email!: string;
}
