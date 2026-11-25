import argon2, { argon2id, type HashOptions } from "argon2";
import type { Request } from "express";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/errors.js";
import { hashToken, randomToken } from "../utils/security.js";
import { recordAudit } from "./audit.service.js";
import { ROLE_DEFINITIONS } from "../config/roles.js";

export const SESSION_COOKIE = "ocg_session";
export const CSRF_COOKIE = "ocg_csrf";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    status: string;
    mustChangePassword: boolean;
    roles: Array<{ role: { name: string; permissions: unknown } }>;
  };
  session?: {
    id: string;
    userId: string;
    csrfTokenHash: string;
    expiresAt: Date;
  };
}

const argonOptions: HashOptions = {
  type: argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, argonOptions);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export async function ensureRoles(): Promise<void> {
  for (const role of ROLE_DEFINITIONS) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description, permissions: role.permissions },
      create: { name: role.name, description: role.description, permissions: role.permissions },
    });
  }
}

export const userSelect = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  status: true,
  mustChangePassword: true,
  roles: { select: { role: { select: { name: true, permissions: true } } } },
} as const;

export type UserWithRoles = NonNullable<Awaited<ReturnType<typeof getUserWithRoles>>>;

export async function getUserWithRoles(userId: string) {
  return prisma.user.findFirst({
    where: { id: userId, deletedAt: null, status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      mustChangePassword: true,
      lastLoginAt: true,
      createdAt: true,
      roles: { select: { role: { select: { id: true, name: true, description: true, permissions: true } } } },
    },
  });
}

export function permissionsFor(user: { roles: Array<{ role?: { permissions?: unknown }; permissions?: unknown }> } | null): string[] {
  if (!user) return [];
  return [...new Set(user.roles.flatMap((entry) => {
    const permissions = entry.role?.permissions ?? entry.permissions;
    return Array.isArray(permissions) ? permissions as string[] : [];
  }))];
}

export async function createSession(
  userId: string,
  request: Request,
): Promise<{ token: string; csrfToken: string; expiresAt: Date }> {
  const token = randomToken();
  const csrfToken = randomToken();
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      csrfTokenHash: hashToken(csrfToken),
      userAgent: String(request.headers["user-agent"] || "Unknown client").slice(0, 500),
      ipAddress: request.ip || "unknown",
      expiresAt,
    },
  });
  return { token, csrfToken, expiresAt };
}

export async function authenticate(
  email: string,
  password: string,
  request: Request,
): Promise<{ user: UserWithRoles; token: string; csrfToken: string; expiresAt: Date }> {
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), deletedAt: null },
    select: userSelect,
  });
  if (!user || user.status !== "ACTIVE" || !(await verifyPassword(user.passwordHash, password))) {
    await recordAudit("auth.login.failed", "User", null, { email: email.toLowerCase() }, { request });
    throw new ApiError(401, "Invalid email or password.", undefined, "INVALID_CREDENTIALS");
  }
  const session = await createSession(user.id, request);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const fullUser = await getUserWithRoles(user.id);
  if (!fullUser) throw new ApiError(401, "Invalid email or password.", undefined, "INVALID_CREDENTIALS");
  await recordAudit("auth.login.succeeded", "User", user.id, { email: user.email }, { request, userId: user.id, userEmail: user.email });
  return { user: fullUser, ...session };
}

export async function sessionUser(token: string | undefined): Promise<{ user: UserWithRoles; session: { id: string; userId: string; csrfTokenHash: string; expiresAt: Date } } | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, deletedAt: true, status: true } } },
  });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.status !== "ACTIVE" || session.user.deletedAt) {
    if (session && !session.revokedAt) await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } }).catch(() => undefined);
    return null;
  }
  const user = await getUserWithRoles(session.userId);
  if (!user) return null;
  return {
    user,
    session: {
      id: session.id,
      userId: session.userId,
      csrfTokenHash: session.csrfTokenHash,
      expiresAt: session.expiresAt,
    },
  };
}

export async function revokeSession(sessionId: string, userId: string, request: Request): Promise<void> {
  const session = await prisma.session.findFirst({ where: { id: sessionId, userId } });
  if (!session) throw new ApiError(404, "Session not found.");
  await prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
  await recordAudit("auth.logout", "Session", sessionId, {}, { request, userId, userEmail: undefined });
}

export async function revokeUserSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  request: Request,
): Promise<void> {
  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null }, select: { id: true, passwordHash: true } });
  if (!user || !(await verifyPassword(user.passwordHash, currentPassword))) {
    throw new ApiError(400, "The current password is incorrect.", undefined, "INVALID_PASSWORD");
  }
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash, mustChangePassword: false } }),
    prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
  await recordAudit("auth.password.changed", "User", userId, {}, { request, userId });
}

export async function requestPasswordReset(email: string, request: Request): Promise<{ resetToken?: string }> {
  const user = await prisma.user.findFirst({ where: { email: email.toLowerCase(), deletedAt: null }, select: { id: true, email: true } });
  if (!user) {
    await recordAudit("auth.password_reset.requested", "User", null, { email: email.toLowerCase() }, { request });
    return {};
  }
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TTL_MINUTES * 60 * 60 * 1000);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hashToken(token), expiresAt },
  });
  const url = `${env.PUBLIC_APP_URL.replace(/\/$/, "")}/admin/#reset-password?token=${encodeURIComponent(token)}`;
  const sent = await sendResetEmail(user.email, url);
  if (!sent && env.isProduction) console.warn("Password reset token created; outbound mail is not configured.");
  await recordAudit("auth.password_reset.requested", "User", user.id, { delivery: sent ? "email" : "server" }, { request, userId: user.id, userEmail: user.email });
  return env.EXPOSE_PASSWORD_RESET && !env.isProduction ? { resetToken: token } : {};
}

async function sendResetEmail(email: string, url: string): Promise<boolean> {
  const { sendPasswordResetEmail } = await import("./mail.service.js");
  return sendPasswordResetEmail(email, url);
}

export async function resetPassword(token: string, password: string, request: Request): Promise<void> {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: { select: { id: true, email: true } } } });
  if (!record || record.usedAt || record.expiresAt <= new Date()) {
    throw new ApiError(400, "This password reset link is invalid or has expired.", undefined, "INVALID_RESET_TOKEN");
  }
  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash, mustChangePassword: false } }),
    prisma.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
  await recordAudit("auth.password.reset", "User", record.userId, {}, { request, userId: record.userId, userEmail: record.user.email });
}