import "dotenv/config";
import { z } from "zod";

const bool = z.enum(["true", "false"]).transform((value) => value === "true");
const optionalString = z.string().trim().optional().default("");
const providerSchema = z.enum(["local", "supabase"]).default("local");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.coerce.number().int().min(1).max(65535).default(3000)
  ),
  PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:8000"),
  API_PUBLIC_URL: z.string().url().default("http://127.0.0.1:3000/api/v1"),
  CORS_ORIGINS: z.string().default("http://127.0.0.1:8000,http://localhost:8000"),
  COOKIE_SECURE: bool.default(false),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: optionalString,
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(50).default(5),

  STORAGE_PROVIDER: providerSchema,
  STORAGE_LOCAL_ROOT: optionalString,
  SUPABASE_URL: optionalString,
  SUPABASE_SECRET_KEY: optionalString,
  SUPABASE_PUBLIC_MEDIA_BUCKET: z.string().trim().min(1).default("ocg-public-media"),
  SUPABASE_PRIVATE_MEDIA_BUCKET: z.string().trim().min(1).default("ocg-private-media"),
  SUPABASE_SIGNED_URL_TTL_SECONDS: z.coerce.number().int().min(60).max(604800).default(3600),

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
}).superRefine((value, ctx) => {
  if (value.STORAGE_PROVIDER === "supabase") {
    if (!value.SUPABASE_URL) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["SUPABASE_URL"], message: "SUPABASE_URL is required when STORAGE_PROVIDER=supabase" });
    if (!value.SUPABASE_SECRET_KEY) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["SUPABASE_SECRET_KEY"], message: "SUPABASE_SECRET_KEY is required when STORAGE_PROVIDER=supabase" });
  }
  if (value.NODE_ENV === "production" && value.EXPOSE_PASSWORD_RESET) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["EXPOSE_PASSWORD_RESET"], message: "EXPOSE_PASSWORD_RESET must be false in production" });
  }
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
