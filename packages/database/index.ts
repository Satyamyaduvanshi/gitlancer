// packages/database/index.ts
import { PrismaClient } from './generated/client'; // <-- Removed .js
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

let prismaInstance: PrismaClient | null = null;

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

export { PrismaClient } from './generated/client'; // <-- Removed .js