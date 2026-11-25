import type { Request, Response } from "express";
import type { AuthRequest } from "../services/auth.service.js";
import type { SubmissionStatus } from "../generated/prisma/client.js";
import { recordAudit } from "../services/audit.service.js";
import { sendCreated, sendOk } from "../utils/http.js";
import { parsePagination } from "../utils/query.js";
import { uploadMedia } from "../services/media.service.js";
import * as submissions from "../services/submission.service.js";

function q(request: Request, key: string): string | undefined {
  const value = request.query[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function param(request: Request, name: string): string {
  const value = request.params[name];
  return Array.isArray(value) ? value[0] || "" : String(value || "");
}

export async function contact(request: Request, response: Response): Promise<void> {
  if (request.body.website) {
    sendCreated(response, { received: true }, "Thank you.");
    return;
  }
  const item = await submissions.createContact(request.body, request);
  await recordAudit("submission.contact.created", "ContactSubmission", item.id, { email: item.email }, { request });
  sendCreated(response, { id: item.id, received: true }, "Thank you for contacting OCG.");
}

export async function partnership(request: Request, response: Response): Promise<void> {
  if (request.body.website) {
    sendCreated(response, { received: true }, "Thank you.");
    return;
  }
  let attachmentId: string | null = null;
  if (request.file) {
    const asset = await uploadMedia(request.file, "PRIVATE", null, {
      altText: request.file.originalname,
      description: "Partnership submission attachment",
    });
    attachmentId = asset.id;
  }
  const item = await submissions.createPartnership(request.body, request);
  if (attachmentId) {
    const { prisma } = await import("../prisma/client.js");
    await prisma.partnershipSubmission.update({ where: { id: item.id }, data: { attachmentId } });
  }
  await recordAudit("submission.partnership.created", "PartnershipSubmission", item.id, { email: item.email, attachmentId }, { request });
  sendCreated(response, { id: item.id, received: true }, "Thank you for your partnership enquiry.");
}

export async function survey(request: Request, response: Response): Promise<void> {
  if (request.body.website) {
    sendCreated(response, { received: true }, "Thank you.");
    return;
  }
  const item = await submissions.createSurvey(request.body, request);
  await recordAudit("submission.survey.created", "SurveySubmission", item.id, { area: item.area }, { request });
  sendCreated(response, { id: item.id, received: true }, "Thank you for your feedback.");
}

export async function list(request: Request, response: Response): Promise<void> {
  const resource = param(request, "resource") as "contact" | "partnership" | "survey";
  const { page, limit, skip, take } = parsePagination(request.query as Record<string, unknown>);
  const result = await submissions.listSubmissions(resource, {
    page, limit, skip, take, status: q(request, "status"), q: q(request, "q"),
  });
  sendOk(response, { items: result.items, meta: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) } });
}

export async function get(request: Request, response: Response): Promise<void> {
  const resource = param(request, "resource") as "contact" | "partnership" | "survey";
  sendOk(response, await submissions.getSubmission(resource, param(request, "id")));
}

export async function updateStatus(request: Request, response: Response): Promise<void> {
  const resource = param(request, "resource") as "contact" | "partnership" | "survey";
  const user = (request as AuthRequest).user!;
  const body = request.body as { status: SubmissionStatus };
  const item = await submissions.updateSubmissionStatus(resource, param(request, "id"), body.status, user.id);
  await recordAudit("submission.status_updated", resource === "contact" ? "ContactSubmission" : resource === "partnership" ? "PartnershipSubmission" : "SurveySubmission", param(request, "id"), { status: body.status }, { request, userId: user.id, userEmail: user.email });
  sendOk(response, item, "Submission updated.");
}