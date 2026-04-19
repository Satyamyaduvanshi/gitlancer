// packages/database/index.ts

import { PrismaClient } from './generated/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// We create a variable to hold our singleton
let prismaInstance: PrismaClient | null = null;

// This function ensures we only create the client when we actually need it
export const getPrisma = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('❌ DATABASE_URL is missing from environment variables!');
  }

  const adapter = new PrismaNeon({ connectionString });
  prismaInstance = new PrismaClient({ adapter });
  
  return prismaInstance;
};

// Also export the type for the Oracle service
export { PrismaClient } from './generated/client';