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

  async fetchFiles(userId: string, cubeId: string) {
    const path = this.getPath(userId, cubeId);
    let continuationToken: string | undefined;
    const allFiles: string[] = [];

    try {
      do {
        const command = new s3.ListObjectsV2Command({
          Bucket: this.bucket_name,
          Prefix: path,
          ContinuationToken: continuationToken,
        });
        const response = await this.s3_client.send(command);

        if (response.Contents) {
          response.Contents.forEach((object) => {
            if (object.Key) {
              allFiles.push(object.Key);
            }
          });
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      const files: FileObject[] = [];
      await Promise.all(
        allFiles.map(async (key) => {
          const file = await this.getFileContent(key);
          const content = await file.transformToString();
          const actual_path = this.getRelativePathFromKey(key, path);
          files.push({
            path: actual_path,
            content: content,
          });
        }),
      );

      return files;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getFileContent(key: string) {
    try {
      const command = new s3.GetObjectCommand({
        Bucket: this.bucket_name,
        Key: key,
      });

      const response = await this.s3_client.send(command);

      return response.Body;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getRelativePathFromKey(key: string, path: string) {
    const trimmed = key.replace(path, '');
    return trimmed;
  }

  getPath(userId: string, cubeId: string, path: string = '') {
    return this.base_path + '/' + userId + '/' + cubeId + '/' + path;
  }
}
