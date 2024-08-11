import * as env from 'dotenv';

env.config();
export const configurations = {
  container: {
    user_container_image: 'manthan23s/lynx-user-container',
    network: 'server_lynx-network',
  },
  app: {},
  env: {
    JWT_SECRET: process.env.JWT_SECRET || '',
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  },
};
