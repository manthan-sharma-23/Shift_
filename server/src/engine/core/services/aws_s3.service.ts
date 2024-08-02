import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { configurations } from 'src/lib/config';

interface InputDir {
  userId: string;
  folders?: string[];
  folder: string;
}

@Injectable()
export default class S3Service {
  private bucket_name = 'manthan-bucket-1';
  private access_key_id = configurations.env.S3_ACCESS_KEY;
  private secret_access_key = configurations.env.S3_SECRET_ACCESS_KEY;
  private root_dir = '/lynux/';
  private s3_client: S3Client;

  constructor() {
    this.s3_client = new S3Client({
      credentials: {
        accessKeyId: this.access_key_id,
        secretAccessKey: this.secret_access_key,
      },
      region: 'ap-south-1',
    });
  }

  async create_folder(root: InputDir) {}
}
