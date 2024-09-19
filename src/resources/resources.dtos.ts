import { IsOptional, IsString } from "class-validator";

export class AddResourcesDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
