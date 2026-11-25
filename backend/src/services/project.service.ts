import type { Prisma, ProjectStatus } from "../generated/prisma/client.js";
import { randomUUID } from "node:crypto";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import { sanitizeRichText } from "../utils/sanitize.js";
import { publicAsset, slugify } from "./content-utils.js";
import type { z } from "zod";
import type { projectCreateSchema, projectUpdateSchema } from "../validators/content.js";

type CreateData = z.infer<typeof projectCreateSchema>;
type UpdateData = z.infer<typeof projectUpdateSchema>;

const publicInclude = {
  coverImage: true,
  attachments: {
    where: { mediaAsset: { visibility: "PUBLIC", deletedAt: null } },
    include: { mediaAsset: true },
    orderBy: { sortOrder: "asc" },
  },
  images: {
    where: { mediaAsset: { visibility: "PUBLIC", deletedAt: null } },
    include: { mediaAsset: true },
    orderBy: { sortOrder: "asc" },
  },
  statusHistory: { orderBy: { changedAt: "desc" }, take: 12 },
} as const;

const adminInclude = {
  coverImage: true,
  attachments: { include: { mediaAsset: true }, orderBy: { sortOrder: "asc" } },
  images: { include: { mediaAsset: true }, orderBy: { sortOrder: "asc" } },
  statusHistory: { orderBy: { changedAt: "desc" }, take: 50 },
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

function baseData(data: CreateData | UpdateData, userId?: string): Prisma.ProjectUncheckedCreateInput {
  const value = data as CreateData;
  return {
    reference: value.reference || "",
    title: value.title,
    slug: value.slug || slugify(value.title),
    shortDescription: value.shortDescription || "",
    description: sanitizeRichText(value.description || ""),
    category: value.category || "General",
    constructionSector: value.constructionSector || "General construction",
    client: value.client ?? null,
    contractor: value.contractor ?? null,
    consultant: value.consultant ?? null,
    location: value.location || "Ethiopia",
    region: value.region,
    country: value.country || "Ethiopia",
    latitude: value.latitude ?? null,
    longitude: value.longitude ?? null,
    contractValue: value.contractValue ?? null,
    currency: value.currency || "ETB",
    fundingSource: value.fundingSource,
    contractType: value.contractType,
    startDate: value.startDate ?? null,
    plannedCompletionDate: value.plannedCompletionDate ?? null,
    actualCompletionDate: value.actualCompletionDate ?? null,
    progress: value.progress ?? 0,
    financialProgress: value.financialProgress ?? null,
    projectManager: value.projectManager,
    coverImageId: value.coverImageId,
    status: value.status || "PROPOSED",
    featured: value.featured ?? false,
    published: value.published ?? false,
    publishedAt: value.published ? new Date() : undefined,
    createdById: userId,
    updatedById: userId,
  };
}

function publicProject(project: Record<string, any>): Record<string, any> {
  const cover = project.coverImage && project.coverImage.visibility === "PUBLIC" && !project.coverImage.deletedAt
    ? publicAsset(project.coverImage)
    : null;
  const images = (project.images || [])
    .filter((image: any) => image.mediaAsset?.visibility === "PUBLIC" && !image.mediaAsset?.deletedAt)
    .map((image: any) => ({ ...image, mediaAsset: publicAsset(image.mediaAsset) }));
  const attachments = (project.attachments || [])
    .filter((attachment: any) => attachment.mediaAsset?.visibility === "PUBLIC" && !attachment.mediaAsset?.deletedAt)
    .map((attachment: any) => ({ ...attachment, mediaAsset: publicAsset(attachment.mediaAsset) }));
  const { createdById: _createdById, updatedById: _updatedById, statusHistory, ...rest } = project;
  const history = (statusHistory || []).map((entry: any) => ({
    previousStatus: entry.previousStatus,
    newStatus: entry.newStatus,
    note: entry.note,
    changedAt: entry.changedAt,
  }));
  return { ...rest, coverImage: cover, images, attachments, statusHistory: history };
}

export async function listProjects(params: {
  page: number; limit: number; skip: number; take: number; q?: string;
  status?: string; category?: string; featured?: string; sort?: string; admin?: boolean;
}) {
  const where: Prisma.ProjectWhereInput = { deletedAt: null };
  if (!params.admin) where.published = true;
  if (params.status) where.status = params.status as any;
  if (params.category) where.category = { contains: params.category };
  if (params.featured === "true") where.featured = true;
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { reference: { contains: params.q } },
      { shortDescription: { contains: params.q } },
      { location: { contains: params.q } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      include: params.admin ? adminInclude : publicInclude,
      orderBy: params.sort?.startsWith("-") ? { [params.sort.slice(1)]: "desc" } : { [params.sort || "createdAt"]: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    prisma.project.count({ where }),
  ]);
  return { items: items.map((item) => params.admin ? item : publicProject(item as any)), total };
}

export async function getProject(id: string, admin = false) {
  const project = await prisma.project.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { published: true }) },
    include: admin ? adminInclude : publicInclude,
  });
  if (!project) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  return admin ? project : publicProject(project as any);
}

export async function getPublicProject(slug: string) {
  const project = await prisma.project.findFirst({
    where: { slug, published: true, deletedAt: null },
    include: publicInclude,
  });
  if (!project) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  return publicProject(project as any);
}

export async function createProject(data: CreateData, userId: string) {
  const { galleryMediaIds, attachmentIds, ...rest } = data;
  const reference = rest.reference || `OCG-${randomUUID().slice(0, 8).toUpperCase()}`;
  const base = baseData({ ...rest, reference } as CreateData, userId) as Prisma.ProjectUncheckedCreateInput;
  const project = await prisma.project.create({
    data: {
      ...base,
      images: galleryMediaIds?.length ? { create: galleryMediaIds.map((mediaAssetId, index) => ({ mediaAssetId, sortOrder: index, altText: rest.title })) } : undefined,
      attachments: attachmentIds?.length ? { create: attachmentIds.map((mediaAssetId, index) => ({ mediaAssetId, sortOrder: index })) } : undefined,
      statusHistory: { create: { newStatus: base.status as any, changedById: userId, note: "Project created" } },
    },
    include: adminInclude,
  });
  return project;
}

export async function updateProject(id: string, data: UpdateData, userId: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null }, select: { id: true, status: true, published: true } });
  if (!existing) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  const { galleryMediaIds, attachmentIds: _attachmentIds, ...rest } = data;
  const update: Prisma.ProjectUncheckedUpdateInput = {
    ...rest,
    shortDescription: rest.shortDescription === undefined ? undefined : (rest.shortDescription || ""),
    description: rest.description === undefined ? undefined : sanitizeRichText(rest.description || ""),
    category: rest.category === undefined ? undefined : (rest.category || "General"),
    constructionSector: rest.constructionSector === undefined ? undefined : (rest.constructionSector || "General construction"),
    location: rest.location === undefined ? undefined : (rest.location || "Ethiopia"),
    slug: rest.slug === undefined ? undefined : (rest.slug || (rest.title ? slugify(rest.title) : undefined)),
    updatedById: userId,
  };
  if (data.published !== undefined) update.publishedAt = data.published ? new Date() : null;
  if (data.status && data.status !== existing.status) {
    update.status = data.status;
  }
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.update({ where: { id }, data: update, include: adminInclude });
    if (galleryMediaIds?.length) {
      await tx.projectImage.createMany({
        data: galleryMediaIds.map((mediaAssetId, index) => ({ projectId: id, mediaAssetId, sortOrder: index + 100, altText: rest.title || project.title })),
        skipDuplicates: true,
      });
    }
    if (data.status && data.status !== existing.status) {
      await tx.projectStatusHistory.create({
        data: { projectId: id, previousStatus: existing.status, newStatus: data.status, changedById: userId, note: "Status changed through project update" },
      });
    }
    return tx.project.findUniqueOrThrow({ where: { id }, include: adminInclude });
  });
}

export async function updateProjectStatus(id: string, status: ProjectStatus, note: string | null, userId: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null }, select: { id: true, status: true } });
  if (!existing) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  if (existing.status === status) return getProject(id, true);
  return prisma.$transaction(async (tx) => {
    await tx.project.update({ where: { id }, data: { status, updatedById: userId } });
    await tx.projectStatusHistory.create({
      data: { projectId: id, previousStatus: existing.status, newStatus: status, changedById: userId, note },
    });
    return tx.project.findUniqueOrThrow({ where: { id }, include: adminInclude });
  });
}

export async function setProjectPublished(id: string, published: boolean, userId: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null }, select: { id: true, published: true } });
  if (!existing) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  if (existing.published === published) return getProject(id, true);
  await prisma.project.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null, updatedById: userId },
  });
  return getProject(id, true);
}

export async function deleteProject(id: string, userId: string) {
  const existing = await prisma.project.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  await prisma.project.update({ where: { id }, data: { deletedAt: new Date(), updatedById: userId } });
  return { id };
}

export async function replaceProjectGallery(id: string, mediaIds: string[], userId: string) {
  const project = await prisma.project.findFirst({ where: { id, deletedAt: null }, select: { id: true, title: true } });
  if (!project) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  await prisma.$transaction([
    prisma.projectImage.deleteMany({ where: { projectId: id } }),
    prisma.projectImage.createMany({
      data: mediaIds.map((mediaAssetId, index) => ({ projectId: id, mediaAssetId, sortOrder: index, altText: project.title })),
      skipDuplicates: true,
    }),
    prisma.project.update({ where: { id }, data: { updatedById: userId } }),
  ]);
  return getProject(id, true);
}

export async function replaceProjectAttachments(id: string, mediaIds: string[], userId: string) {
  const project = await prisma.project.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!project) throw new ApiError(404, "Project not found.", undefined, "PROJECT_NOT_FOUND");
  await prisma.$transaction([
    prisma.projectAttachment.deleteMany({ where: { projectId: id } }),
    prisma.projectAttachment.createMany({
      data: mediaIds.map((mediaAssetId, index) => ({ projectId: id, mediaAssetId, sortOrder: index })),
      skipDuplicates: true,
    }),
    prisma.project.update({ where: { id }, data: { updatedById: userId } }),
  ]);
  return getProject(id, true);
}

export async function removeProjectImage(id: string, imageId: string, userId: string) {
  const image = await prisma.projectImage.findFirst({ where: { id: imageId, projectId: id } });
  if (!image) throw new ApiError(404, "Project image not found.", undefined, "IMAGE_NOT_FOUND");
  await prisma.$transaction([
    prisma.projectImage.delete({ where: { id: imageId } }),
    prisma.project.update({ where: { id }, data: { updatedById: userId } }),
  ]);
  return getProject(id, true);
}