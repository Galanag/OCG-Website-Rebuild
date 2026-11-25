import type { EventStatus, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import { sanitizeRichText } from "../utils/sanitize.js";
import { publicAsset, slugify } from "./content-utils.js";
import type { z } from "zod";
import type { eventCreateSchema, eventUpdateSchema } from "../validators/content.js";

type CreateData = z.infer<typeof eventCreateSchema>;
type UpdateData = z.infer<typeof eventUpdateSchema>;

const adminInclude = {
  eventImage: true,
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

const publicInclude = { eventImage: true } as const;

function publicEvent(event: Record<string, any>): Record<string, any> {
  const { createdById: _createdById, updatedById: _updatedById, ...rest } = event;
  return {
    ...rest,
    eventImage: publicAsset(event.eventImage),
  };
}

function baseData(data: CreateData | UpdateData, userId?: string): Prisma.EventUncheckedCreateInput {
  const value = data as CreateData;
  return {
    title: value.title,
    slug: value.slug || slugify(value.title),
    description: sanitizeRichText(value.description || ""),
    category: value.category || "General",
    eventImageId: value.eventImageId,
    startsAt: value.startsAt,
    endsAt: value.endsAt,
    location: value.location,
    onlineMeetingUrl: value.onlineMeetingUrl,
    registrationUrl: value.registrationUrl,
    organizer: value.organizer,
    contactInfo: value.contactInfo,
    status: (value.status || "UPCOMING") as EventStatus,
    published: value.published ?? false,
    publishedAt: value.published ? new Date() : undefined,
    featured: value.featured ?? false,
    createdById: userId,
    updatedById: userId,
  };
}

export async function listEvents(params: {
  page: number; limit: number; skip: number; take: number; q?: string;
  status?: string; timeframe?: string; sort?: string; admin?: boolean;
}) {
  const where: Prisma.EventWhereInput = { deletedAt: null };
  if (!params.admin) where.published = true;
  if (params.status) where.status = params.status as EventStatus;
  if (params.timeframe === "upcoming") where.startsAt = { gte: new Date() };
  if (params.timeframe === "past") where.startsAt = { lt: new Date() };
  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
      { location: { contains: params.q } },
      { organizer: { contains: params.q } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      include: params.admin ? adminInclude : publicInclude,
      orderBy: params.sort?.startsWith("-") ? { [params.sort.slice(1)]: "desc" } : { [params.sort || "startsAt"]: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    prisma.event.count({ where }),
  ]);
  return { items: items.map((item) => params.admin ? item : publicEvent(item as any)), total };
}

export async function getEvent(id: string, admin = false) {
  const event = await prisma.event.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { published: true }) },
    include: admin ? adminInclude : publicInclude,
  });
  if (!event) throw new ApiError(404, "Event not found.", undefined, "EVENT_NOT_FOUND");
  return admin ? event : publicEvent(event as any);
}

export async function getPublicEvent(slug: string) {
  const event = await prisma.event.findFirst({
    where: { slug, published: true, deletedAt: null },
    include: publicInclude,
  });
  if (!event) throw new ApiError(404, "Event not found.", undefined, "EVENT_NOT_FOUND");
  return publicEvent(event as any);
}

export async function createEvent(data: CreateData, userId: string) {
  return prisma.event.create({ data: baseData(data, userId), include: adminInclude });
}

export async function updateEvent(id: string, data: UpdateData, userId: string) {
  const existing = await prisma.event.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Event not found.", undefined, "EVENT_NOT_FOUND");
  const update: Prisma.EventUncheckedUpdateInput = {
    ...data,
    description: data.description === undefined ? undefined : sanitizeRichText(data.description || ""),
    category: data.category === undefined ? undefined : (data.category || "General"),
    slug: data.slug === undefined ? undefined : (data.slug || (data.title ? slugify(data.title) : undefined)),
    updatedById: userId,
  };
  if (data.published !== undefined) update.publishedAt = data.published ? new Date() : null;
  await prisma.event.update({ where: { id }, data: update });
  return getEvent(id, true);
}

export async function setEventPublished(id: string, published: boolean, userId: string) {
  const existing = await prisma.event.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Event not found.", undefined, "EVENT_NOT_FOUND");
  await prisma.event.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null, updatedById: userId },
  });
  return getEvent(id, true);
}

export async function deleteEvent(id: string, userId: string) {
  const existing = await prisma.event.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Event not found.", undefined, "EVENT_NOT_FOUND");
  await prisma.event.update({ where: { id }, data: { deletedAt: new Date(), updatedById: userId } });
  return { id };
}