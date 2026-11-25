import type { Request, Response } from "express";
import type { AuthRequest } from "../services/auth.service.js";
import { recordAudit } from "../services/audit.service.js";
import { parsePagination } from "../utils/query.js";
import { sendCreated, sendNoContent, sendOk } from "../utils/http.js";
import * as projects from "../services/project.service.js";
import * as announcements from "../services/announcement.service.js";
import * as news from "../services/news.service.js";
import * as events from "../services/event.service.js";

function q(request: Request, key: string): string | undefined {
  const value = request.query[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function pagination(request: Request) {
  return parsePagination(request.query as Record<string, unknown>);
}

function actor(request: Request): { id: string; email: string } {
  const user = (request as AuthRequest).user!;
  return { id: user.id, email: user.email };
}

function param(request: Request, name: string): string {
  const value = request.params[name];
  return Array.isArray(value) ? value[0] || "" : String(value || "");
}

async function audit(request: Request, action: string, entityType: string, entityId: string | null | undefined, metadata: Record<string, unknown> = {}): Promise<void> {
  const user = actor(request);
  await recordAudit(action, entityType, entityId, metadata, { request, userId: user.id, userEmail: user.email });
}

export async function listProjects(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin") || q(request, "scope") === "admin";
  const result = await projects.listProjects({
    ...pagination(request), q: q(request, "q"), status: q(request, "status"),
    category: q(request, "category"), featured: q(request, "featured"),
    sort: q(request, "sort"), admin,
  });
  const { page, limit } = pagination(request);
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function getProject(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  sendOk(response, await projects.getProject(param(request, "id"), admin));
}

export async function getPublicProject(request: Request, response: Response): Promise<void> {
  sendOk(response, await projects.getPublicProject(param(request, "slug")));
}

export async function createProject(request: Request, response: Response): Promise<void> {
  const project = await projects.createProject(request.body, actor(request).id);
  await audit(request, "project.created", "Project", project.id, { title: project.title });
  sendCreated(response, project);
}

export async function updateProject(request: Request, response: Response): Promise<void> {
  const project = await projects.updateProject(param(request, "id"), request.body, actor(request).id);
  await audit(request, "project.updated", "Project", project.id, { title: project.title });
  sendOk(response, project, "Project updated.");
}

export async function updateProjectStatus(request: Request, response: Response): Promise<void> {
  const body = request.body as { status: Parameters<typeof projects.updateProjectStatus>[1]; note?: string | null };
  const project = await projects.updateProjectStatus(param(request, "id"), body.status, body.note || null, actor(request).id);
  await audit(request, "project.status_changed", "Project", project.id, { status: body.status });
  sendOk(response, project, "Project status updated.");
}

export async function setProjectPublished(request: Request, response: Response): Promise<void> {
  const body = request.body as { published: boolean };
  const project = await projects.setProjectPublished(param(request, "id"), body.published, actor(request).id);
  await audit(request, body.published ? "project.published" : "project.unpublished", "Project", project.id, {});
  sendOk(response, project, body.published ? "Project published." : "Project unpublished.");
}

export async function deleteProject(request: Request, response: Response): Promise<void> {
  await projects.deleteProject(param(request, "id"), actor(request).id);
  await audit(request, "project.deleted", "Project", param(request, "id"), {});
  sendNoContent(response);
}

export async function replaceProjectGallery(request: Request, response: Response): Promise<void> {
  const body = request.body as { mediaIds: string[] };
  const project = await projects.replaceProjectGallery(param(request, "id"), body.mediaIds, actor(request).id);
  await audit(request, "project.gallery_replaced", "Project", project.id, { count: body.mediaIds.length });
  sendOk(response, project, "Project gallery updated.");
}

export async function removeProjectImage(request: Request, response: Response): Promise<void> {
  const project = await projects.removeProjectImage(param(request, "id"), param(request, "imageId"), actor(request).id);
  await audit(request, "project.image_removed", "Project", project.id, { imageId: param(request, "imageId") });
  sendOk(response, project);
}

export async function replaceProjectAttachments(request: Request, response: Response): Promise<void> {
  const body = request.body as { mediaIds: string[] };
  const project = await projects.replaceProjectAttachments(param(request, "id"), body.mediaIds, actor(request).id);
  await audit(request, "project.attachments_updated", "Project", project.id, { count: body.mediaIds.length });
  sendOk(response, project, "Project attachments updated.");
}

export async function listAnnouncements(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  const result = await announcements.listAnnouncements({
    ...pagination(request), q: q(request, "q"), category: q(request, "category"),
    kind: q(request, "kind"), state: q(request, "state"), sort: q(request, "sort"), admin,
  });
  const { page, limit } = pagination(request);
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function getAnnouncement(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  sendOk(response, await announcements.getAnnouncement(param(request, "id"), admin));
}

export async function getPublicAnnouncement(request: Request, response: Response): Promise<void> {
  sendOk(response, await announcements.getPublicAnnouncement(param(request, "slug")));
}

export async function createAnnouncement(request: Request, response: Response): Promise<void> {
  const item = await announcements.createAnnouncement(request.body, actor(request).id);
  await audit(request, "announcement.created", "Announcement", item.id, { title: item.title, category: item.category });
  sendCreated(response, item);
}

export async function updateAnnouncement(request: Request, response: Response): Promise<void> {
  const item = await announcements.updateAnnouncement(param(request, "id"), request.body, actor(request).id);
  await audit(request, "announcement.updated", "Announcement", item.id, { title: item.title });
  sendOk(response, item, "Announcement updated.");
}

export async function setAnnouncementPublished(request: Request, response: Response): Promise<void> {
  const body = request.body as { published: boolean };
  const item = await announcements.setAnnouncementPublished(param(request, "id"), body.published, actor(request).id);
  await audit(request, body.published ? "announcement.published" : "announcement.unpublished", "Announcement", item.id, {});
  sendOk(response, item);
}

export async function deleteAnnouncement(request: Request, response: Response): Promise<void> {
  await announcements.deleteAnnouncement(param(request, "id"), actor(request).id);
  await audit(request, "announcement.deleted", "Announcement", param(request, "id"), {});
  sendNoContent(response);
}

export async function replaceAnnouncementAttachments(request: Request, response: Response): Promise<void> {
  const body = request.body as { mediaIds: string[] };
  const item = await announcements.updateAnnouncement(param(request, "id"), { attachmentIds: body.mediaIds }, actor(request).id);
  await audit(request, "announcement.attachments_updated", "Announcement", item.id, { count: body.mediaIds.length });
  sendOk(response, item, "Announcements attachments updated.");
}

export async function listNews(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  const result = await news.listNews({
    ...pagination(request), q: q(request, "q"), category: q(request, "category"),
    tag: q(request, "tag"), sort: q(request, "sort"), admin,
  });
  const { page, limit } = pagination(request);
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function getNews(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  sendOk(response, await news.getNews(param(request, "id"), admin));
}

export async function getPublicNews(request: Request, response: Response): Promise<void> {
  sendOk(response, await news.getPublicNews(param(request, "slug")));
}

export async function createNews(request: Request, response: Response): Promise<void> {
  const item = await news.createNews(request.body, actor(request).id);
  await audit(request, "news.created", "NewsArticle", item.id, { title: item.title });
  sendCreated(response, item);
}

export async function updateNews(request: Request, response: Response): Promise<void> {
  const item = await news.updateNews(param(request, "id"), request.body, actor(request).id);
  await audit(request, "news.updated", "NewsArticle", item.id, { title: item.title });
  sendOk(response, item, "News article updated.");
}

export async function setNewsPublished(request: Request, response: Response): Promise<void> {
  const body = request.body as { published: boolean };
  const item = await news.setNewsPublished(param(request, "id"), body.published, actor(request).id);
  await audit(request, body.published ? "news.published" : "news.unpublished", "NewsArticle", item.id, {});
  sendOk(response, item);
}

export async function deleteNews(request: Request, response: Response): Promise<void> {
  await news.deleteNews(param(request, "id"), actor(request).id);
  await audit(request, "news.deleted", "NewsArticle", param(request, "id"), {});
  sendNoContent(response);
}

export async function replaceNewsGallery(request: Request, response: Response): Promise<void> {
  const body = request.body as { mediaIds: string[] };
  const item = await news.replaceNewsGallery(param(request, "id"), body.mediaIds, actor(request).id);
  await audit(request, "news.gallery_replaced", "NewsArticle", item.id, { count: body.mediaIds.length });
  sendOk(response, item, "News gallery updated.");
}

export async function listEvents(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  const result = await events.listEvents({
    ...pagination(request), q: q(request, "q"), status: q(request, "status"),
    timeframe: q(request, "timeframe"), sort: q(request, "sort"), admin,
  });
  const { page, limit } = pagination(request);
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function getEvent(request: Request, response: Response): Promise<void> {
  const admin = request.baseUrl.includes("/admin");
  sendOk(response, await events.getEvent(param(request, "id"), admin));
}

export async function getPublicEvent(request: Request, response: Response): Promise<void> {
  sendOk(response, await events.getPublicEvent(param(request, "slug")));
}

export async function createEvent(request: Request, response: Response): Promise<void> {
  const item = await events.createEvent(request.body, actor(request).id);
  await audit(request, "event.created", "Event", item.id, { title: item.title });
  sendCreated(response, item);
}

export async function updateEvent(request: Request, response: Response): Promise<void> {
  const item = await events.updateEvent(param(request, "id"), request.body, actor(request).id);
  await audit(request, "event.updated", "Event", item.id, { title: item.title });
  sendOk(response, item, "Event updated.");
}

export async function setEventPublished(request: Request, response: Response): Promise<void> {
  const body = request.body as { published: boolean };
  const item = await events.setEventPublished(param(request, "id"), body.published, actor(request).id);
  await audit(request, body.published ? "event.published" : "event.unpublished", "Event", item.id, {});
  sendOk(response, item);
}

export async function deleteEvent(request: Request, response: Response): Promise<void> {
  await events.deleteEvent(param(request, "id"), actor(request).id);
  await audit(request, "event.deleted", "Event", param(request, "id"), {});
  sendNoContent(response);
}