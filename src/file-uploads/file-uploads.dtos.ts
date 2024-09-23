import { IsIn, IsNotEmpty, IsString } from "class-validator";

import { ALLOWED_MIME_TYPES } from "./file-uploads.constants";

export class PresignedUrlFile {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_MIME_TYPES)
  type!: string;
}

export class PresignedUrlResponse extends PresignedUrlFile {
  signedUrl!: string;
}
