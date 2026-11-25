import type { Prisma, SubmissionStatus } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import { clientIp, userAgent } from "../utils/security.js";
import type { Request } from "express";
import type { z } from "zod";
import type { contactSchema, partnershipSchema, surveySchema } from "../validators/content.js";

type ContactData = z.infer<typeof contactSchema>;
type PartnershipData = z.infer<typeof partnershipSchema>;
type SurveyData = z.infer<typeof surveySchema>;

function requestMeta(request: Request): { ipAddress: string; userAgent: string } {
  return { ipAddress: clientIp(request), userAgent: userAgent(request) };
}

export async function createContact(data: ContactData, request: Request) {
  const { website: _website, consent: _consent, ...rest } = data;
  return prisma.contactSubmission.create({
    data: {
      ...rest,
      subject: rest.subject || "General enquiry",
      ...requestMeta(request),
    },
  });
}

export async function createPartnership(data: PartnershipData, request: Request) {
  const { website: _website, consent: _consent, ...rest } = data;
  return prisma.partnershipSubmission.create({
    data: { ...rest, ...requestMeta(request) },
  });
}

export async function createSurvey(data: SurveyData, request: Request) {
  const { website: _website, ...rest } = data;
  return prisma.surveySubmission.create({ data: { ...rest, ...requestMeta(request) } });
}

export async function listSubmissions(resource: "contact" | "partnership" | "survey", params: {
  page: number; limit: number; skip: number; take: number; status?: string; q?: string;
}) {
  const status = params.status ? { status: params.status as SubmissionStatus } : {};
  const q = params.q ? {
    OR: [
      { email: { contains: params.q } },
      { subject: { contains: params.q } },
      { message: { contains: params.q } },
    ],
  } : {};
  if (resource === "contact") {
    const [items, total] = await prisma.$transaction([
      prisma.contactSubmission.findMany({
        where: { ...status, ...q },
        include: { reviewedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" }, skip: params.skip, take: params.take,
      }),
      prisma.contactSubmission.count({ where: { ...status, ...q } }),
    ]);
    return { items, total };
  }
  if (resource === "partnership") {
    const [items, total] = await prisma.$transaction([
      prisma.partnershipSubmission.findMany({
        where: { ...status, ...q },
        include: { reviewedBy: { select: { id: true, name: true } }, attachment: true },
        orderBy: { createdAt: "desc" }, skip: params.skip, take: params.take,
      }),
      prisma.partnershipSubmission.count({ where: { ...status, ...q } }),
    ]);
    return { items, total };
  }
  const [items, total] = await prisma.$transaction([
    prisma.surveySubmission.findMany({
      where: { ...status, ...q }, orderBy: { createdAt: "desc" }, skip: params.skip, take: params.take,
    }),
    prisma.surveySubmission.count({ where: { ...status, ...q } }),
  ]);
  return { items, total };
}

export async function getSubmission(resource: "contact" | "partnership" | "survey", id: string) {
  if (resource === "contact") {
    const item = await prisma.contactSubmission.findUnique({ where: { id }, include: { reviewedBy: true } });
    if (!item) throw new ApiError(404, "Submission not found.", undefined, "SUBMISSION_NOT_FOUND");
    return item;
  }
  if (resource === "partnership") {
    const item = await prisma.partnershipSubmission.findUnique({ where: { id }, include: { reviewedBy: true, attachment: true } });
    if (!item) throw new ApiError(404, "Submission not found.", undefined, "SUBMISSION_NOT_FOUND");
    return item;
  }
  const item = await prisma.surveySubmission.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "Submission not found.", undefined, "SUBMISSION_NOT_FOUND");
  return item;
}

export async function updateSubmissionStatus(resource: "contact" | "partnership" | "survey", id: string, status: SubmissionStatus, userId: string) {
  if (resource === "contact") {
    return prisma.contactSubmission.update({
      where: { id },
      data: { status, reviewedById: userId, reviewedAt: new Date() },
    });
  }
  if (resource === "partnership") {
    return prisma.partnershipSubmission.update({
      where: { id },
      data: { status, reviewedById: userId, reviewedAt: new Date() },
    });
  }
  return prisma.surveySubmission.update({ where: { id }, data: { status } });
}

export async function submissionCounts(): Promise<Record<string, number>> {
  const [contact, partnership, survey, pending] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.partnershipSubmission.count(),
    prisma.surveySubmission.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
  ]);
  return { contact, partnership, survey, pending };
}