import { PrismaClient } from "@prisma/client";

// For Supabase: DATABASE_URL is the pooled connection, DIRECT_URL is direct connection
export const db =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL, // Pooled connection for queries
        directUrl: process.env.DIRECT_URL, // Direct connection for migrations
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.
