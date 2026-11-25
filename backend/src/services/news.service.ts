import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import { sanitizeRichText } from "../utils/sanitize.js";
import { publicAsset, slugify } from "./content-utils.js";
import type { z } from "zod";
import type { newsCreateSchema, newsUpdateSchema } from "../validators/content.js";

type CreateData = z.infer<typeof newsCreateSchema>;
type UpdateData = z.infer<typeof newsUpdateSchema>;

const adminInclude = {
  featuredImage: true,
  socialImage: true,
  images: { include: { mediaAsset: true }, orderBy: { sortOrder: "asc" } },
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

const publicInclude = {
  featuredImage: true,
  socialImage: true,
  images: {
    where: { mediaAsset: { visibility: "PUBLIC", deletedAt: null } },
    include: { mediaAsset: true },
    orderBy: { sortOrder: "asc" },
  },
} as const;

function publicNews(article: Record<string, any>): Record<string, any> {
  const { createdById: _createdById, updatedById: _updatedById, ...rest } = article;
  const images = (article.images || [])
    .filter((image: any) => image.mediaAsset?.visibility === "PUBLIC" && !image.mediaAsset?.deletedAt)
    .map((image: any) => ({ ...image, mediaAsset: publicAsset(image.mediaAsset) }));
  return {
    ...rest,
    featuredImage: publicAsset(article.featuredImage),
    socialImage: publicAsset(article.socialImage),
    images,
  };
}

function baseData(data: CreateData | UpdateData, userId?: string): Prisma.NewsArticleUncheckedCreateInput {
  const value = data as CreateData;
  return {
    title: value.title,
    slug: value.slug || slugify(value.title),
    summary: value.summary || "",
    content: sanitizeRichText(value.content || ""),
    category: value.category || "Company",
    tags: value.tags || [],
    featuredImageId: value.featuredImageId,
    socialImageId: value.socialImageId,
    seoTitle: value.seoTitle,
    seoDescription: value.seoDescription,
    authorName: value.authorName,
    published: value.published ?? false,
    publishedAt: value.published ? new Date() : undefined,
    scheduledFor: value.scheduledFor ?? null,
    featured: value.featured ?? false,
    createdById: userId,
    updatedById: userId,
  };
}

export async function listNews(params: {
  page: number; limit: number; skip: number; take: number; q?: string;
  category?: string; tag?: string; sort?: string; admin?: boolean;
}) {
  const where: Prisma.NewsArticleWhereInput = { deletedAt: null };
  if (!params.admin) {
    where.published = true;
    where.AND = [{ OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] }];
  }
  if (params.category) where.category = params.category;
  if (params.tag) where.tags = { array_contains: params.tag } as any;
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { summary: { contains: params.q, mode: 'insensitive' } },
      { content: { contains: params.q, mode: 'insensitive' } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.newsArticle.findMany({
      where,
      include: params.admin ? adminInclude : publicInclude,
      orderBy: params.sort?.startsWith("-") ? { [params.sort.slice(1)]: "desc" } : { [params.sort || "createdAt"]: "asc" },
      skip: params.skip,
      take: params.take,
    }),
    prisma.newsArticle.count({ where }),
  ]);
  return { items: items.map((item) => params.admin ? item : publicNews(item as any)), total };
}

export async function getNews(id: string, admin = false) {
  const article = await prisma.newsArticle.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { published: true, AND: [{ OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] }] }) },
    include: admin ? adminInclude : publicInclude,
  });
  if (!article) throw new ApiError(404, "News article not found.", undefined, "NEWS_NOT_FOUND");
  return admin ? article : publicNews(article as any);
}

export async function getPublicNews(slug: string) {
  const article = await prisma.newsArticle.findFirst({
    where: { slug, published: true, deletedAt: null, AND: [{ OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] }] },
    include: publicInclude,
  });
  if (!article) throw new ApiError(404, "News article not found.", undefined, "NEWS_NOT_FOUND");
  return publicNews(article as any);
}

export async function createNews(data: CreateData, userId: string) {
  const { galleryMediaIds, ...rest } = data;
  return prisma.newsArticle.create({
    data: {
      ...baseData(rest as CreateData, userId),
      images: galleryMediaIds?.length ? {
        create: galleryMediaIds.map((mediaAssetId, index) => ({ mediaAssetId, sortOrder: index, altText: rest.title })),
      } : undefined,
    },
    include: adminInclude,
  });
}

export async function updateNews(id: string, data: UpdateData, userId: string) {
  const existing = await prisma.newsArticle.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "News article not found.", undefined, "NEWS_NOT_FOUND");
  const { galleryMediaIds, ...rest } = data;
  const update: Prisma.NewsArticleUncheckedUpdateInput = {
    ...rest,
    summary: rest.summary === undefined ? undefined : (rest.summary || ""),
    content: rest.content === undefined ? undefined : sanitizeRichText(rest.content || ""),
    category: rest.category === undefined ? undefined : (rest.category || "Company"),
    slug: rest.slug === undefined ? undefined : (rest.slug || (rest.title ? slugify(rest.title) : undefined)),
    updatedById: userId,
  };
  if (data.published !== undefined) update.publishedAt = data.published ? new Date() : null;
  await prisma.$transaction(async (tx) => {
    await tx.newsArticle.update({ where: { id }, data: update });
    if (galleryMediaIds) {
      await tx.newsImage.deleteMany({ where: { newsArticleId: id } });
      if (galleryMediaIds.length) {
        await tx.newsImage.createMany({
          data: galleryMediaIds.map((mediaAssetId, index) => ({ newsArticleId: id, mediaAssetId, sortOrder: index, altText: rest.title || "" })),
          skipDuplicates: true,
        });
      }
    }
  });
  return getNews(id, true);
}

export async function replaceNewsGallery(id: string, mediaIds: string[], userId: string) {
  const article = await prisma.newsArticle.findFirst({ where: { id, deletedAt: null }, select: { id: true, title: true } });
  if (!article) throw new ApiError(404, "News article not found.", undefined, "NEWS_NOT_FOUND");
  await prisma.$transaction([
    prisma.newsImage.deleteMany({ where: { newsArticleId: id } }),
    prisma.newsImage.createMany({
      data: mediaIds.map((mediaAssetId, index) => ({ newsArticleId: id, mediaAssetId, sortOrder: index, altText: article.title })),
      skipDuplicates: true,
    }),
    prisma.newsArticle.update({ where: { id }, data: { updatedById: userId } }),
  ]);
  return getNews(id, true);
}

export async function setNewsPublished(id: string, published: boolean, userId: string) {
  const existing = await prisma.newsArticle.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "News article not found.", undefined, "NEWS_NOT_FOUND");
  await prisma.newsArticle.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null, updatedById: userId },
  });
  return getNews(id, true);
}

export async function deleteNews(id: string, userId: string) {
  const existing = await prisma.newsArticle.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!existing) throw new ApiError(404, "News article not found.", undefined, "NEWS_NOT_FOUND");
  await prisma.newsArticle.update({ where: { id }, data: { deletedAt: new Date(), updatedById: userId } });
  return { id };
}