import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { ApiError } from "../utils/errors.js";

function issues(error: ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({ path: issue.path.join(".") || "body", message: issue.message }));
}

export function validateBody<T>(schema: ZodType<T>) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      next(new ApiError(422, "The submitted data is invalid.", issues(result.error), "VALIDATION_ERROR"));
      return;
    }
    request.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.query);
    if (!result.success) {
      next(new ApiError(422, "The query parameters are invalid.", issues(result.error), "VALIDATION_ERROR"));
      return;
    }
    (request as Request & { validatedQuery?: T }).validatedQuery = result.data;
    next();
  };
}

export function validateParams<T>(schema: ZodType<T>) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      next(new ApiError(422, "The URL parameters are invalid.", issues(result.error), "VALIDATION_ERROR"));
      return;
    }
    request.params = result.data as Record<string, string>;
    next();
  };
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}