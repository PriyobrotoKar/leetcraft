import { PrismaClient } from '../prisma/generated/client';

const globalForPrisma = globalThis as typeof globalThis & {
  db?: PrismaClient;
};

export const db = globalForPrisma.db ?? new PrismaClient();
export * from '../prisma/generated/client';

globalForPrisma.db = db;
