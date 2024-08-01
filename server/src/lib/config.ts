import * as env from 'dotenv';

env.config();
export const configurations = {
  container: { network: 'lynx-network' },
  app: {},
  env: {
    JWT_SECRET: process.env.JWT_SECRET || '',
  },
};
