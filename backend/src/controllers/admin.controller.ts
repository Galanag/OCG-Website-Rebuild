import type { Request, Response } from "express";
import type { AuthRequest } from "../services/auth.service.js";
import { recordAudit } from "../services/audit.service.js";
import { sendCreated, sendNoContent, sendOk } from "../utils/http.js";
import { ApiError } from "../utils/errors.js";
import { parsePagination } from "../utils/query.js";
import * as admin from "../services/admin.service.js";
import * as pageSections from "../services/page-section.service.js";

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

async function audit(request: Request, action: string, entityType: string, entityId: string | null, metadata: Record<string, unknown> = {}): Promise<void> {
  const user = actor(request);
  await recordAudit(action, entityType, entityId, metadata, { request, userId: user.id, userEmail: user.email });
}

export async function dashboard(request: Request, response: Response): Promise<void> {
  sendOk(response, await admin.stats());
}

export async function publicStats(_request: Request, response: Response): Promise<void> {
  sendOk(response, await admin.publicStats());
}

export async function listUsers(request: Request, response: Response): Promise<void> {
  const { page, limit, skip, take } = parsePagination(request.query as Record<string, unknown>);
  const result = await admin.listUsers({ page, limit, skip, take, q: q(request, "q") });
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function getUser(request: Request, response: Response): Promise<void> {
  sendOk(response, await admin.getUser(param(request, "id")));
}

export async function createUser(request: Request, response: Response): Promise<void> {
  const user = await admin.createUser(request.body, actor(request).id);
  await audit(request, "user.created", "User", user.id, { email: user.email });
  sendCreated(response, user, "User created. The initial password must be changed at first sign-in.");
}

export async function updateUser(request: Request, response: Response): Promise<void> {
  const user = await admin.updateUser(param(request, "id"), request.body, actor(request).id);
  await audit(request, "user.updated", "User", user.id, { email: user.email });
  sendOk(response, user, "User updated.");
}

export async function deleteUser(request: Request, response: Response): Promise<void> {
  const user = await admin.deleteUser(param(request, "id"), actor(request).id);
  await audit(request, "user.deleted", "User", user.id, {});
  sendOk(response, user);
}

export async function resetUserPassword(request: Request, response: Response): Promise<void> {
  const body = request.body as { password: string };
  const user = await admin.resetUserPassword(param(request, "id"), body.password, actor(request).id);
  await audit(request, "user.password_reset", "User", user.id, {});
  sendOk(response, user, "User password reset. The user must change it at next sign-in.");
}

export async function listRoles(request: Request, response: Response): Promise<void> {
  sendOk(response, await admin.listRoles());
}

export async function createRole(request: Request, response: Response): Promise<void> {
  const role = await admin.createRole(request.body);
  await audit(request, "role.created", "Role", role.id, { name: role.name });
  sendCreated(response, role, "Role created.");
}

export async function listSettings(request: Request, response: Response): Promise<void> {
  sendOk(response, await admin.listSettings());
}

export async function updateSetting(request: Request, response: Response): Promise<void> {
  const body = request.body as { key: string; value: unknown };
  const setting = await admin.updateSettings(body.key, body.value, actor(request).id);
  await audit(request, "setting.updated", "SiteSetting", body.key, {});
  sendOk(response, setting, "Setting saved.");
}

export async function publicSettings(_request: Request, response: Response): Promise<void> {
  sendOk(response, await admin.publicSettings());
}

export async function auditLogs(request: Request, response: Response): Promise<void> {
  const { page, limit, skip, take } = parsePagination(request.query as Record<string, unknown>);
  const result = await admin.listAuditLogs({ page, limit, skip, take, q: q(request, "q"), action: q(request, "action") });
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function listPageSections(request: Request, response: Response): Promise<void> {
  const pageKey = q(request, "page") || "";
  if (!pageKey) throw new ApiError(400, "A page key is required.");
  sendOk(response, await pageSections.listPageSections(pageKey, request.baseUrl.includes("/admin")));
}

export async function getPageSection(request: Request, response: Response): Promise<void> {
  sendOk(response, await pageSections.getPageSection(param(request, "id"), true));
}

export async function createPageSection(request: Request, response: Response): Promise<void> {
  const section = await pageSections.createPageSection(request.body, actor(request).id);
  await audit(request, "page_section.created", "PageSection", section.id, { pageKey: section.pageKey, sectionKey: section.sectionKey });
  sendCreated(response, section, "Company content section created.");
}

export async function updatePageSection(request: Request, response: Response): Promise<void> {
  const section = await pageSections.updatePageSection(param(request, "id"), request.body, actor(request).id);
  await audit(request, "page_section.updated", "PageSection", section.id, { pageKey: section.pageKey });
  sendOk(response, section, "Company content section updated.");
}

export async function deletePageSection(request: Request, response: Response): Promise<void> {
  await pageSections.deletePageSection(param(request, "id"), actor(request).id);
  await audit(request, "page_section.deleted", "PageSection", param(request, "id"), {});
  sendNoContent(response);
}