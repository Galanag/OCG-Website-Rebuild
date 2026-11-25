import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiError } from "../utils/errors.js";

export function sameOrigin(request: Request, _response: Response, next: NextFunction): void {
  const origin = request.get("Origin");
  const fetchSite = request.get("Sec-Fetch-Site");
  if (fetchSite === "cross-site") {
    next(new ApiError(403, "Cross-site form submissions are not accepted.", undefined, "CROSS_ORIGIN"));
    return;
  }
  if (origin) {
    const allowed = new Set([...env.corsOrigins, env.PUBLIC_APP_URL, env.API_PUBLIC_URL]);
    if (!allowed.has(origin)) {
      next(new ApiError(403, "This origin is not allowed to submit forms.", undefined, "ORIGIN_NOT_ALLOWED"));
      return;
    }
  }
  next();
}