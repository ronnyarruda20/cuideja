import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 usa driver adapters. PostgreSQL via node-postgres (pg).
// A DATABASE_URL vem do ambiente (Railway em produção; .env no local).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Singleton — evita abrir várias conexões durante o hot-reload do dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
