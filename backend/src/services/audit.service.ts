import type { Request } from "express";
import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { clientIp, userAgent } from "../utils/security.js";

export interface AuditContext {
  request?: Request;
  userId?: string | null;
  userEmail?: string | null;
  ipAddress?: string;
  userAgent?: string;
}

export async function recordAudit(
  action: string,
  entityType: string,
  entityId: string | null | undefined,
  metadata: Record<string, unknown> = {},
  context: AuditContext = {},
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: context.userId || null,
        userEmail: context.userEmail || null,
        action,
        entityType,
        entityId: entityId || null,
        metadata: metadata as Prisma.InputJsonValue,
        ipAddress: context.ipAddress || (context.request ? clientIp(context.request) : null),
        userAgent: context.userAgent || (context.request ? userAgent(context.request) : null),
      },
    });
  } catch (error) {
    // Audit persistence must not roll back the business operation, but failures are
    // deliberately logged so operators can investigate database availability.
    console.error("Audit log write failed", error);
  }
}