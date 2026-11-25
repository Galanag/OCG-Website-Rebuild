import "dotenv/config";
import { z } from "zod";

const bool = z.enum(["true", "false"]).transform((value) => value === "true");
const optionalString = z.string().trim().optional().default("");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:8000"),
  API_PUBLIC_URL: z.string().url().default("http://127.0.0.1:3000/api/v1"),
  CORS_ORIGINS: z.string().default("http://127.0.0.1:8000,http://localhost:8000"),
  COOKIE_SECURE: bool.default(false),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_HOST: optionalString,
  DATABASE_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  DATABASE_USER: optionalString,
  DATABASE_PASSWORD: optionalString,
  DATABASE_NAME: optionalString,
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(50).default(5),
  ADMIN_NAME: optionalString,
  ADMIN_EMAIL: optionalString,
  ADMIN_PASSWORD: optionalString,
  SMTP_HOST: optionalString,
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_SECURE: bool.default(false),
  SMTP_USER: optionalString,
  SMTP_PASSWORD: optionalString,
  SMTP_FROM: optionalString,
  EXPOSE_PASSWORD_RESET: bool.default(false),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(8),
  PASSWORD_RESET_TTL_MINUTES: z.coerce.number().int().min(5).max(1440).default(30),
  UPLOAD_MAX_BYTES: z.coerce.number().int().min(1024).max(50 * 1024 * 1024).default(10 * 1024 * 1024),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test",
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  cookieSecure: parsed.data.NODE_ENV === "production" ? true : parsed.data.COOKIE_SECURE,
} as const;

export type AppEnv = typeof env;