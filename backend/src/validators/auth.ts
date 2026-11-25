import { z } from "zod";
import { emailSchema } from "./common.js";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(200),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(12, "Use at least 12 characters").max(200),
});
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12, "Use at least 12 characters").max(200),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: emailSchema,
  password: z.string().min(12).max(200),
  roleIds: z.array(z.string().min(1)).min(1).max(10).optional(),
});
export const userUpdateSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "INVITED"]).optional(),
  roleIds: z.array(z.string().min(1)).min(1).max(10).optional(),
  mustChangePassword: z.boolean().optional(),
});
export const passwordResetByAdminSchema = z.object({
  password: z.string().min(12).max(200),
});

export const roleCreateSchema = z.object({
  name: z.string().trim().min(1).max(60).regex(/^[A-Z0-9_]+$/, "Use uppercase letters, numbers and underscores"),
  description: z.string().trim().min(1).max(500),
  permissions: z.array(z.string().trim().min(1).max(80)).min(1).max(50),
});
export const settingsSchema = z.object({
  key: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9._:-]+$/),
  value: z.unknown(),
});