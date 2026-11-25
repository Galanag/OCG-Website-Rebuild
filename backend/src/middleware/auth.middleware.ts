import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/http.js";
import { ApiError } from "../utils/errors.js";
import { hashToken } from "../utils/security.js";
import { CSRF_COOKIE, SESSION_COOKIE, permissionsFor, sessionUser, type AuthRequest } from "../services/auth.service.js";

export const requireAuth = asyncHandler(async (request: Request, _response: Response, next: NextFunction) => {
  const token = request.cookies?.[SESSION_COOKIE];
  const result = await sessionUser(typeof token === "string" ? token : undefined);
  if (!result) throw new ApiError(401, "Authentication required.", undefined, "UNAUTHENTICATED");
  const authRequest = request as AuthRequest;
  authRequest.user = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    mustChangePassword: result.user.mustChangePassword,
    roles: result.user.roles,
  };
  authRequest.session = result.session;
  next();
});

export function requirePermission(permission: string) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const user = (request as AuthRequest).user;
    if (!user) {
      next(new ApiError(401, "Authentication required.", undefined, "UNAUTHENTICATED"));
      return;
    }
    if (!permissionsFor(user).includes(permission)) {
      next(new ApiError(403, `This action requires the ${permission} permission.`, undefined, "FORBIDDEN"));
      return;
    }
    next();
  };
}

export function requireCsrf(request: Request, _response: Response, next: NextFunction): void {
  const auth = request as AuthRequest;
  const sent = request.get("X-CSRF-Token");
  const cookie = request.cookies?.[CSRF_COOKIE];
  if (!sent || !cookie || sent !== cookie || !auth.session || hashToken(sent) !== auth.session.csrfTokenHash) {
    next(new ApiError(403, "Invalid or missing CSRF token. Refresh the page and try again.", undefined, "CSRF_INVALID"));
    return;
  }
  next();
}

export function requireCsrfForMutation(request: Request, response: Response, next: NextFunction): void {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    next();
    return;
  }
  requireCsrf(request, response, next);
}