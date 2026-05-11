import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  
  // During build time, DATABASE_URL might not be available
  // Return a placeholder client that will be initialized at runtime
  if (!databaseUrl && process.env.NEXT_PHASE === "phase-production-build") {
    return new PrismaClient({
      accelerateUrl: "postgresql://placeholder:placeholder@localhost:5432/placeholder",
    });
  }

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please add it to your .env.local file or Vercel environment variables."
    );
  }

  return new PrismaClient({
    accelerateUrl: databaseUrl,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
