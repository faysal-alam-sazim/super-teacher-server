import { Injectable } from "@nestjs/common";

import { S3Service } from "@/common/aws/s3-service/s3-service";

import { PresignedUrlFile } from "./file-uploads.dtos";

@Injectable()
export class FileUploadsService {
  constructor(private readonly s3Service: S3Service) {}

  async getPresignedUrl(file: PresignedUrlFile) {
    const { name, type } = file;
    const signedUrl = await this.s3Service.getPresignedUrl(name, type);
    return { name, type, signedUrl };
  }

  async uploadToS3(url: string, file: Express.Multer.File) {
    const response = await fetch(url, {
      method: "PUT",
      body: file.buffer,
      headers: {
        "Content-Type": file.mimetype,
      },
    });
    return response;
  }
}
