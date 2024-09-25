import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

import { S3Service } from "@/common/aws/s3-service/s3-service";

import { PresignedUrlFile } from "./file-uploads.dtos";

@Injectable()
export class FileUploadsService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
  ) {}

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

  async handleFileUpload(file: Express.Multer.File) {
    let fileUrl: string;
    try {
      const presignedUrlFile = new PresignedUrlFile();
      presignedUrlFile.name = `${randomUUID()}-${new Date().getTime()}-${file.originalname}`;
      presignedUrlFile.type = file.mimetype;

      const { name, signedUrl } = await this.getPresignedUrl(presignedUrlFile);

      await this.uploadToS3(signedUrl, file);

      fileUrl = `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET_NAME}//${name}`;
    } catch (error) {
      throw new BadRequestException("Failed to upload file");
    }

    return fileUrl;
  }

  async deleteFromS3(key: string) {
    const deleteParams = {
      Bucket: await this.configService.get("AWS_S3_BUCKET_NAME"),
      Key: key,
    };
    const command = new DeleteObjectCommand(deleteParams);
    const response = await this.s3Client.send(command);
    return response;
  }
}
