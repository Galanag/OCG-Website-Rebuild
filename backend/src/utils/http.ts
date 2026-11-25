import type { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler(
  handler: (request: Request, response: Response, next: NextFunction) => Promise<unknown> | unknown,
): RequestHandler {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

export function sendCreated(response: Response, data: unknown, message = "Created successfully."): void {
  response.status(201).json({ data, message });
}

export function sendOk(response: Response, data: unknown, message?: string): void {
  response.status(200).json({ data, ...(message ? { message } : {}) });
}

export function sendNoContent(response: Response): void {
  response.status(204).send();
}