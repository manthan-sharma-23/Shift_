import * as s3 from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { FileObject } from 'src/engine/types/static/container';
import { configurations } from 'src/lib/config';

@Injectable()
export default class S3Service {
  private bucket_name = 'manthan-bucket-1';
  private access_key_id = configurations.env.S3_ACCESS_KEY;
  private secret_access_key = configurations.env.S3_SECRET_ACCESS_KEY;
  private base_path = 'lynx-storage';
  private s3_client: s3.S3Client;
  private bucket_region = 'ap-south-1';

  constructor() {
    this.s3_client = new s3.S3Client({
      credentials: {
        accessKeyId: this.access_key_id,
        secretAccessKey: this.secret_access_key,
      },
      region: this.bucket_region,
    });
  }

  async uploadFiles(files: FileObject[], userId: string, cubeId: string) {
    try {
      files.forEach(async (file) => {
        const isSuccess = await this.uploadFile(file, userId, cubeId);
        if (isSuccess) {
          console.log(`${file.path} uploaded successfully`);
        } else {
          console.log(`couldn't upload file ${file.path}`);
        }
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async uploadFile(file: FileObject, userId: string, cubeId: string) {
    try {
      const command = new s3.PutObjectCommand({
        Bucket: this.bucket_name,
        Key: this.getPath(userId, cubeId, file.path),
        Body: file.content,
      });
      await this.s3_client.send(command);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getPath(userId: string, cubeId: string, path: string) {
    return this.base_path + '/' + userId + '/' + cubeId + '/' + path;
  }
}
