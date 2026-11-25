import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../config/env.js";

function databaseParts(): {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
} {
  const url = new URL(env.DATABASE_URL);
  return {
    host: env.DATABASE_HOST || url.hostname || "127.0.0.1",
    port: env.DATABASE_PORT || Number(url.port || 3306),
    user: env.DATABASE_USER || decodeURIComponent(url.username),
    password: env.DATABASE_PASSWORD || decodeURIComponent(url.password),
    database: env.DATABASE_NAME || decodeURIComponent(url.pathname.replace(/^\//, "")),
  };
}

const parts = databaseParts();
const adapter = new PrismaMariaDb({
  host: parts.host,
  port: parts.port,
  user: parts.user,
  password: parts.password,
  database: parts.database,
  connectionLimit: env.DATABASE_CONNECTION_LIMIT,
});

export const prisma = new PrismaClient({
  adapter,
  log: env.LOG_LEVEL === "debug" ? ["query", "warn", "error"] : ["warn", "error"],
});

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}