import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../services/auth.service.js";
import { recordAudit } from "../services/audit.service.js";
import { ApiError } from "../utils/errors.js";
import { sendCreated, sendNoContent, sendOk } from "../utils/http.js";
import { parsePagination } from "../utils/query.js";
import * as media from "../services/media.service.js";

function q(request: Request, key: string): string | undefined {
  const value = request.query[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function actor(request: Request): { id: string; email: string } {
  const user = (request as AuthRequest).user!;
  return { id: user.id, email: user.email };
}

function param(request: Request, name: string): string {
  const value = request.params[name];
  return Array.isArray(value) ? value[0] || "" : String(value || "");
}

async function audit(request: Request, action: string, entityId: string, metadata: Record<string, unknown> = {}): Promise<void> {
  const user = actor(request);
  await recordAudit(action, "MediaAsset", entityId, metadata, { request, userId: user.id, userEmail: user.email });
}

export async function upload(request: Request, response: Response): Promise<void> {
  if (!request.file) throw new ApiError(400, "A file is required.");
  const visibility = (request.body.visibility || "PUBLIC") as "PUBLIC" | "PRIVATE";
  const asset = await media.uploadMedia(request.file, visibility, actor(request).id, {
    altText: request.body.altText || null,
    description: request.body.description || null,
  });
  await audit(request, "media.uploaded", asset.id, { visibility, originalName: asset.originalName });
  sendCreated(response, asset, "Media uploaded.");
}

export async function list(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  const { page, limit, skip, take } = parsePagination(request.query as Record<string, unknown>);
  const result = await media.listMedia({
    page, limit, skip, take, q: q(request, "q"), kind: q(request, "kind"),
    visibility: q(request, "visibility"), admin,
  });
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function get(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  sendOk(response, await media.getMedia(param(request, "id"), admin));
}

export async function update(request: Request, response: Response): Promise<void> {
  const asset = await media.updateMedia(param(request, "id"), request.body, actor(request).id);
  await audit(request, "media.updated", asset.id, { visibility: request.body.visibility });
  sendOk(response, asset, "Media updated.");
}

export async function remove(request: Request, response: Response): Promise<void> {
  await media.deleteMedia(param(request, "id"));
  await audit(request, "media.deleted", param(request, "id"), {});
  sendNoContent(response);
}

export async function file(request: Request, response: Response, next: NextFunction): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  const asset = await media.getMediaForFile(param(request, "id"), admin);
  const absolutePath = media.resolveMediaPath(asset);
  const download = request.query.download === "1" || request.query.download === "true";
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Content-Disposition", `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(asset.originalName)}"`);
  response.sendFile(absolutePath, (error: Error | undefined) => {
    if (error && !response.headersSent) next(error);
  });
}