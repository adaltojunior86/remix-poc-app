import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line vars-on-top, no-unused-vars, no-var
  var db: PrismaClient;
}

// eslint-disable-next-line import/no-mutable-exports
let db: PrismaClient;

if (process.env.NODE_ENV !== 'production') {
  db = new PrismaClient();
} else {
  if (!global.db) {
    global.db = new PrismaClient();
  }
  db = global.db;
  db.$connect();
}

export { db };
