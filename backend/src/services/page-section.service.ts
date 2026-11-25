import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import type { z } from "zod";
import type { pageSectionCreateSchema, pageSectionUpdateSchema } from "../validators/content.js";

type CreateData = z.infer<typeof pageSectionCreateSchema>;
type UpdateData = z.infer<typeof pageSectionUpdateSchema>;

export async function listPageSections(pageKey: string, admin: boolean) {
  return prisma.pageSection.findMany({
    where: { pageKey, deletedAt: null, ...(admin ? {} : { published: true }) },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { image: true, updatedBy: { select: { id: true, name: true } } },
  });
}

export async function getPageSection(id: string, admin = false) {
  const section = await prisma.pageSection.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { published: true }) },
    include: { image: true },
  });
  if (!section) throw new ApiError(404, "Page section not found.", undefined, "PAGE_SECTION_NOT_FOUND");
  return section;
}

export async function createPageSection(data: CreateData, userId: string) {
  return prisma.pageSection.create({
    data: {
      pageKey: data.pageKey,
      sectionKey: data.sectionKey,
      title: data.title,
      content: data.content || "",
      metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
      imageId: data.imageId,
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? true,
      createdById: userId,
      updatedById: userId,
    },
  });
}

export async function updatePageSection(id: string, data: UpdateData, userId: string) {
  const existing = await prisma.pageSection.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Page section not found.", undefined, "PAGE_SECTION_NOT_FOUND");
  return prisma.pageSection.update({
    where: { id },
    data: {
      pageKey: data.pageKey,
      sectionKey: data.sectionKey,
      title: data.title,
      content: data.content,
      metadata: data.metadata === undefined ? undefined : data.metadata as Prisma.InputJsonValue,
      imageId: data.imageId,
      sortOrder: data.sortOrder,
      published: data.published,
      updatedById: userId,
    },
  });
}

export async function deletePageSection(id: string, userId: string) {
  const existing = await prisma.pageSection.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Page section not found.", undefined, "PAGE_SECTION_NOT_FOUND");
  await prisma.pageSection.update({ where: { id }, data: { deletedAt: new Date(), updatedById: userId } });
  return { id };
}