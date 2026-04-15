import { defineConfig, env } from 'prisma/config';
import * as dotenv from 'dotenv';
import path from 'path';

// 1. Manually load the .env from the Turborepo root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // 2. Use DIRECT_URL for 'db push' to bypass the Neon pooler
    url: env('DIRECT_URL'), 
  },
  migrations: {
    path: './prisma/migrations',
  },
});