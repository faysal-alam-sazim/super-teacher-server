import { IsString } from "class-validator";

export class AddResourcesDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}
