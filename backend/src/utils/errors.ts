import { Prisma } from "../generated/prisma/client.js";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
    public readonly code = "API_ERROR",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isPrismaKnownError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function errorResponse(error: unknown): {
  status: number;
  body: { error: { code: string; message: string; details?: unknown } };
} {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: { error: { code: error.code, message: error.message, details: error.details } },
    };
  }
  if (isPrismaKnownError(error)) {
    if (error.code === "P2002") {
      return {
        status: 409,
        body: {
          error: {
            code: "DUPLICATE_VALUE",
            message: "A record with the same unique value already exists.",
            details: error.meta,
          },
        },
      };
    }
    if (error.code === "P2025") {
      return { status: 404, body: { error: { code: "NOT_FOUND", message: "The requested record was not found." } } };
    }
    if (error.code === "P2003") {
      return {
        status: 409,
        body: { error: { code: "RELATED_RECORD", message: "The operation conflicts with a related record." } },
      };
    }
  }
  return {
    status: 500,
    body: { error: { code: "INTERNAL_ERROR", message: "An unexpected server error occurred." } },
  };
}