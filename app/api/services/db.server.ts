import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the PrismaClient instance.
// Using a unique name like __cachedPrisma helps avoid naming conflicts.
declare global {
  // eslint-disable-next-line no-var
  var __cachedPrisma: PrismaClient | undefined;
}

// Initialize the PrismaClient instance.
// If a cached instance exists on the global object (e.g., due to hot-reloading
// in development), reuse it. Otherwise, create a new instance.
const db: PrismaClient = global.__cachedPrisma || new PrismaClient();

// If not in a production environment, cache the PrismaClient instance on the
// global object. This is essential for preventing multiple instances from being
// created during hot-reloading in development.
if (process.env.NODE_ENV !== 'production') {
  global.__cachedPrisma = db;
}

// Export the single PrismaClient instance.
export { db };
