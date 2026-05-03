
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../../../.env') }); 

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ rawBody: true });

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
  
  await app.listen(3000);
}
bootstrap();