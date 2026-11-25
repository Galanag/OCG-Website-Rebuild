import { createHash, randomBytes, randomUUID } from "node:crypto";

export const newId = (): string => randomUUID();

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function clientIp(request: { ip?: string; headers: Record<string, unknown> }): string {
  const forwarded = request.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (typeof value === "string" ? value.split(",")[0]?.trim() : undefined) || request.ip || "unknown";
}

export function userAgent(request: { headers: Record<string, unknown> }): string {
  const value = request.headers["user-agent"];
  return (typeof value === "string" ? value : "Unknown client").slice(0, 500);
}