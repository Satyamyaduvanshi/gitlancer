import { PrismaClient } from './generated/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node.js environments
neonConfig.webSocketConstructor = ws;

// Pass the connection string inside a config object
// This lets Prisma manage the pool internally and avoids the TS(2345) error
const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL 
});

export const prisma = new PrismaClient({ adapter });
export * from './generated/client';