import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 3000,
  });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    // Log slow queries in development
    ...(process.env.NODE_ENV === "development"
      ? { log: ["warn", "error"] }
      : { log: ["error"] }),
  });

  // Store pool reference for cleanup
  globalForPrisma.pool = pool;

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
