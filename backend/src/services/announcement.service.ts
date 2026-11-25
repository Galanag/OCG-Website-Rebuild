import type { AnnouncementCategory, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import { sanitizeRichText } from "../utils/sanitize.js";
import { publicAsset, slugify } from "./content-utils.js";
import type { z } from "zod";
import type { announcementCreateSchema, announcementUpdateSchema } from "../validators/content.js";

type CreateData = z.infer<typeof announcementCreateSchema>;
type UpdateData = z.infer<typeof announcementUpdateSchema>;

const adminInclude = {
  attachments: { include: { mediaAsset: true }, orderBy: { sortOrder: "asc" } },
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

const publicInclude = {
  attachments: {
    where: { mediaAsset: { visibility: "PUBLIC", deletedAt: null } },
    include: { mediaAsset: true },
    orderBy: { sortOrder: "asc" },
  },
} as const;

export function announcementState(announcement: {
  published: boolean;
  scheduledFor?: Date | null;
  deadline?: Date | null;
  submissionDeadline?: Date | null;
}): "OPEN" | "CLOSED" | "UPCOMING" {
  const now = new Date();
  const deadline = announcement.submissionDeadline || announcement.deadline;
  if (deadline && deadline < now) return "CLOSED";
  if (announcement.scheduledFor && announcement.scheduledFor > now) return "UPCOMING";
  return "OPEN";
}

function publicAnnouncement(announcement: Record<string, any>): Record<string, any> {
  const attachments = (announcement.attachments || [])
    .filter((item: any) => item.mediaAsset?.visibility === "PUBLIC" && !item.mediaAsset?.deletedAt)
    .map((item: any) => ({ ...item, mediaAsset: publicAsset(item.mediaAsset) }));
  const { createdById: _createdById, updatedById: _updatedById, ...rest } = announcement;
  return { ...rest, attachments, state: announcementState(announcement as {
    published: boolean; scheduledFor?: Date | null; deadline?: Date | null; submissionDeadline?: Date | null;
  }) };
}

function baseData(data: CreateData | UpdateData, userId?: string): Prisma.AnnouncementUncheckedCreateInput {
  const value = data as CreateData;
  return {
    title: value.title,
    slug: value.slug || slugify(value.title),
    category: value.category as AnnouncementCategory,
    reference: value.reference,
    summary: value.summary || "",
    content: sanitizeRichText(value.content || ""),
    applicationInstructions: value.applicationInstructions,
    externalApplicationUrl: value.externalApplicationUrl,
    featured: value.featured ?? false,
    published: value.published ?? false,
    publishedAt: value.published ? new Date() : undefined,
    scheduledFor: value.scheduledFor ?? null,
    deadline: value.deadline ?? null,
    positionTitle: value.positionTitle,
    department: value.department,
    vacancyCount: value.vacancyCount ?? null,
    requiredQualifications: value.requiredQualifications,
    experienceRequirements: value.experienceRequirements,
    employmentType: value.employmentType,
    dutyStation: value.dutyStation,
    tenderReference: value.tenderReference,
    tenderTitle: value.tenderTitle,
    procurementCategory: value.procurementCategory,
    eligibilityRequirements: value.eligibilityRequirements,
    scopeOfWork: value.scopeOfWork,
    submissionDeadline: value.submissionDeadline ?? null,
    bidOpeningInformation: value.bidOpeningInformation,
    submissionInstructions: value.submissionInstructions,
    contactInformation: value.contactInformation,
    salaryRange: value.salaryRange,
    responsibilities: value.responsibilities,
    tenderValue: value.tenderValue ?? null,
    currency: value.currency || null,
    submissionLocation: value.submissionLocation,
    openingDate: value.openingDate ?? null,
    contactPerson: value.contactPerson,
    createdById: userId,
    updatedById: userId,
  };
}

export async function listAnnouncements(params: {
  page: number; limit: number; skip: number; take: number; q?: string;
  category?: string; kind?: string; state?: string; sort?: string; admin?: boolean;
}) {
  const where: Prisma.AnnouncementWhereInput = { deletedAt: null };
  if (!params.admin) {
    where.published = true;
    where.AND = [{ OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] }];
  }
  if (params.category) where.category = params.category as AnnouncementCategory;
  if (params.kind === "vacancy") where.category = "JOB_VACANCY";
  if (params.kind === "tender") where.category = "BID_TENDER";
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { reference: { contains: params.q } },
      { summary: { contains: params.q } },
      { positionTitle: { contains: params.q } },
      { tenderReference: { contains: params.q } },
    ];
  }
  if (params.state === "OPEN") {
    where.OR = [
      { deadline: null, submissionDeadline: null },
      { deadline: { gte: new Date() } },
      { submissionDeadline: { gte: new Date() } },
    ];
  } else if (params.state === "CLOSED") {
    where.deadline = { lt: new Date() };
  } else if (params.state === "UPCOMING") {
    where.scheduledFor = { gte: new Date() };
  }
  const [items, total] = await prisma.$transaction([
    prisma.announcement.findMany({
      where,
      include: params.admin ? adminInclude : publicInclude,
      orderBy: params.sort?.startsWith("-") ? { [params.sort.slice(1)]: "desc" } : { [params.sort || "createdAt"]: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    prisma.announcement.count({ where }),
  ]);
  return { items: items.map((item) => params.admin ? item : publicAnnouncement(item as any)), total };
}

export async function getAnnouncement(id: string, admin = false) {
  const announcement = await prisma.announcement.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { published: true, AND: [{ OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] }] }) },
    include: admin ? adminInclude : publicInclude,
  });
  if (!announcement) throw new ApiError(404, "Announcement not found.", undefined, "ANNOUNCEMENT_NOT_FOUND");
  return admin ? announcement : publicAnnouncement(announcement as any);
}

export async function getPublicAnnouncement(slug: string) {
  const announcement = await prisma.announcement.findFirst({
    where: { slug, published: true, deletedAt: null, AND: [{ OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] }] },
    include: publicInclude,
  });
  if (!announcement) throw new ApiError(404, "Announcement not found.", undefined, "ANNOUNCEMENT_NOT_FOUND");
  return publicAnnouncement(announcement as any);
}

export async function createAnnouncement(data: CreateData, userId: string) {
  const { attachmentIds, ...rest } = data;
  const base = baseData(rest as CreateData, userId);
  return prisma.announcement.create({
    data: {
      ...base,
      attachments: attachmentIds?.length ? {
        create: attachmentIds.map((mediaAssetId, index) => ({ mediaAssetId, sortOrder: index })),
      } : undefined,
    },
    include: adminInclude,
  });
}

export async function updateAnnouncement(id: string, data: UpdateData, userId: string) {
  const existing = await prisma.announcement.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Announcement not found.", undefined, "ANNOUNCEMENT_NOT_FOUND");
  const { attachmentIds, ...rest } = data;
  const update: Prisma.AnnouncementUncheckedUpdateInput = {
    ...rest,
    summary: rest.summary === undefined ? undefined : (rest.summary || ""),
    content: rest.content === undefined ? undefined : sanitizeRichText(rest.content || ""),
    slug: rest.slug === undefined ? undefined : (rest.slug || (rest.title ? slugify(rest.title) : undefined)),
    updatedById: userId,
  };
  if (data.published !== undefined) update.publishedAt = data.published ? new Date() : null;
  return prisma.$transaction(async (tx) => {
    if (attachmentIds) {
      await tx.announcementAttachment.deleteMany({ where: { announcementId: id } });
      if (attachmentIds.length) {
        await tx.announcementAttachment.createMany({ data: attachmentIds.map((mediaAssetId, index) => ({ announcementId: id, mediaAssetId, sortOrder: index })) });
      }
    }
    await tx.announcement.update({ where: { id }, data: update });
    return tx.announcement.findUniqueOrThrow({ where: { id }, include: adminInclude });
  });
}

export async function setAnnouncementPublished(id: string, published: boolean, userId: string) {
  const existing = await prisma.announcement.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Announcement not found.", undefined, "ANNOUNCEMENT_NOT_FOUND");
  await prisma.announcement.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null, updatedById: userId },
  });
  return getAnnouncement(id, true);
}

export async function deleteAnnouncement(id: string, userId: string) {
  const existing = await prisma.announcement.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Announcement not found.", undefined, "ANNOUNCEMENT_NOT_FOUND");
  await prisma.announcement.update({ where: { id }, data: { deletedAt: new Date(), updatedById: userId } });
  return { id };
}