import { join } from 'path';
import * as dotenv from 'dotenv';

// 🛡️ THE FIX: It will try to load a local .env for dev, but won't crash in Docker 
// if it's missing (since Render provides variables directly to the OS).
dotenv.config({ path: join(__dirname, '../../../.env') }); 

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Content-Encoding', 
      'Accept-Encoding',
      'x-blockchain-ids', 
      'x-action-version'
    ],
    exposedHeaders: ['x-blockchain-ids', 'x-action-version'],
  });

  console.log('🔑 Database Check:', process.env.DATABASE_URL ? 'URL Found ✅' : 'URL Missing ❌');
  
  // 🛡️ THE FIX: Render dynamic port injection + Docker 0.0.0.0 host binding
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 SOLUX Oracle Backend is running on port: ${port}`);
}
bootstrap();