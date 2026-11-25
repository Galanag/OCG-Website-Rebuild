import type { Request, Response } from "express";
import { env } from "../config/env.js";
import {
  CSRF_COOKIE, SESSION_COOKIE, authenticate, changePassword as changeUserPassword, permissionsFor,
  requestPasswordReset, resetPassword, revokeSession,
  type AuthRequest,
} from "../services/auth.service.js";
import { recordAudit } from "../services/audit.service.js";
import { sendCreated, sendOk } from "../utils/http.js";
import { ApiError } from "../utils/errors.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "lax" as const,
  path: "/",
  maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000,
};

export async function login(request: Request, response: Response): Promise<void> {
  const { email, password } = request.body as { email: string; password: string };
  const result = await authenticate(email, password, request);
  response.cookie(SESSION_COOKIE, result.token, cookieOptions);
  response.cookie(CSRF_COOKIE, result.csrfToken, {
    ...cookieOptions, httpOnly: false, sameSite: "lax",
  });
  sendOk(response, {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      roles: result.user.roles,
      mustChangePassword: result.user.mustChangePassword,
    },
    csrfToken: result.csrfToken,
  }, "Signed in successfully.");
}

export async function me(request: Request, response: Response): Promise<void> {
  const auth = request as AuthRequest;
  if (!auth.user) throw new ApiError(401, "Authentication required.", undefined, "UNAUTHENTICATED");
  const csrfToken = request.cookies?.[CSRF_COOKIE];
  sendOk(response, {
    user: auth.user,
    permissions: permissionsFor(auth.user),
    csrfToken,
  });
}

export async function logout(request: Request, response: Response): Promise<void> {
  const auth = request as AuthRequest;
  if (!auth.user || !auth.session) throw new ApiError(401, "Authentication required.", undefined, "UNAUTHENTICATED");
  await revokeSession(auth.session.id, auth.user.id, request);
  response.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined });
  response.clearCookie(CSRF_COOKIE, { ...cookieOptions, httpOnly: false, maxAge: undefined });
  sendOk(response, { signedOut: true }, "Signed out successfully.");
}

export async function forgotPassword(request: Request, response: Response): Promise<void> {
  const { email } = request.body as { email: string };
  const result = await requestPasswordReset(email, request);
  sendOk(response, { message: "If an account exists for that email, a reset link has been prepared.", ...result });
}

export async function resetPasswordHandler(request: Request, response: Response): Promise<void> {
  const { token, password } = request.body as { token: string; password: string };
  await resetPassword(token, password, request);
  sendOk(response, { reset: true }, "Your password has been reset. Please sign in again.");
}

export async function changePassword(request: Request, response: Response): Promise<void> {
  const auth = request as AuthRequest;
  if (!auth.user) throw new ApiError(401, "Authentication required.", undefined, "UNAUTHENTICATED");
  const { currentPassword, newPassword } = request.body as { currentPassword: string; newPassword: string };
  await changeUserPassword(auth.user.id, currentPassword, newPassword, request);
  response.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined });
  response.clearCookie(CSRF_COOKIE, { ...cookieOptions, httpOnly: false, maxAge: undefined });
  sendOk(response, { changed: true }, "Password changed. All sessions were revoked; please sign in again.");
}

export async function currentUser(request: Request): Promise<NonNullable<AuthRequest["user"]>> {
  const auth = request as AuthRequest;
  if (!auth.user) throw new ApiError(401, "Authentication required.", undefined, "UNAUTHENTICATED");
  return auth.user;
}