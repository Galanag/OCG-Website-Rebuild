import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import type { MediaVisibility, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/errors.js";
import { publicAsset } from "./content-utils.js";
import { getStorage, storageRoot } from "./storage.js";
import type { z } from "zod";
import type { mediaUpdateSchema } from "../validators/content.js";

const allowedMimes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
]);

const imageMimes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(mime: string, originalName: string): string {
  const fromName = path.extname(originalName).replace(".", "").toLowerCase();
  const byMime: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
    "application/pdf": "pdf", "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/zip": fromName || "zip",
  };
  return (byMime[mime] || fromName || "bin").replace(/[^a-z0-9]/g, "").slice(0, 12) || "bin";
}

type StoredRef = { provider: "local" | "supabase"; bucket?: string; objectKey: string; url: string };

function parseStoredRef(filePath: string): StoredRef {
  if (filePath.startsWith("supabase://")) {
    const rest = filePath.slice("supabase://".length);
    const [bucket, ...parts] = rest.split("/");
    return { provider: "supabase", bucket, objectKey: parts.join("/"), url: "" };
  }
  return { provider: "local", objectKey: filePath, url: "" };
}

function encodeStoredRef(ref: StoredRef): string {
  if (ref.provider === "supabase") return `supabase://${ref.bucket}/${ref.objectKey}`;
  return ref.objectKey;
}

export async function uploadMedia(
  file: { buffer: Buffer; originalname: string; mimetype: string },
  visibility: MediaVisibility,
  userId: string | null,
  metadata: { altText?: string | null; description?: string | null } = {},
): Promise<import("../generated/prisma/client.js").MediaAsset> {
  if (!file.buffer?.length) throw new ApiError(400, "The uploaded file is empty.");
  if (file.buffer.length > env.UPLOAD_MAX_BYTES) throw new ApiError(413, "The uploaded file exceeds the configured size limit.");
  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected || !allowedMimes.has(detected.mime)) {
    throw new ApiError(415, "File content is not an accepted image or document type.", undefined, "UNSUPPORTED_MEDIA");
  }
  if (imageMimes.has(detected.mime) && detected.mime !== file.mimetype && file.mimetype !== "application/octet-stream") {
    throw new ApiError(415, "The declared MIME type does not match the file content.");
  }
  const extension = extensionFor(detected.mime, file.originalname);
  const kind = imageMimes.has(detected.mime) ? "IMAGE" : "DOCUMENT";
  const storage = getStorage();
  const stored = await storage.put({
    buffer: file.buffer,
    mimeType: detected.mime,
    extension,
    originalName: file.originalname,
    visibility,
    kind,
  });
  const storedName = stored.objectKey.split("/").pop() || `${stored.objectKey}.${extension}`;
  try {
    return await prisma.mediaAsset.create({
      data: {
        originalName: path.basename(file.originalname).slice(0, 255),
        storedName,
        filePath: encodeStoredRef(stored),
        mimeType: detected.mime,
        extension,
        size: file.buffer.length,
        kind,
        visibility,
        altText: metadata.altText || path.basename(file.originalname),
        description: metadata.description || null,
        createdById: userId,
      },
    });
  } catch (error) {
    await storage.delete(stored).catch(() => undefined);
    throw error;
  }
}

const mediaInclude = {
  createdBy: { select: { id: true, name: true, email: true } },
} as const;

export async function listMedia(params: {
  page: number; limit: number; skip: number; take: number; q?: string;
  kind?: string; visibility?: string; admin?: boolean;
}) {
  const where: Prisma.MediaAssetWhereInput = { deletedAt: null };
  if (!params.admin) where.visibility = "PUBLIC";
  else if (params.visibility) where.visibility = params.visibility as MediaVisibility;
  if (params.kind) where.kind = params.kind as "IMAGE" | "DOCUMENT";
  if (params.q) {
    where.OR = [
      { originalName: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { altText: { contains: params.q, mode: "insensitive" } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.mediaAsset.findMany({ where, include: mediaInclude, orderBy: { createdAt: "desc" }, skip: params.skip, take: params.take }),
    prisma.mediaAsset.count({ where }),
  ]);
  return {
    items: items.map((item) => params.admin
      ? { ...item, url: item.visibility === "PUBLIC" ? `/api/v1/media/${item.id}/file` : `/api/v1/admin/media/${item.id}/file` }
      : publicAsset(item)),
    total,
  };
}

export async function getMedia(id: string, admin = false) {
  const asset = await prisma.mediaAsset.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { visibility: "PUBLIC" }) },
    include: mediaInclude,
  });
  if (!asset) throw new ApiError(404, "Media not found.", undefined, "MEDIA_NOT_FOUND");
  if (!admin) {
    const publicAssetValue = publicAsset(asset);
    if (!publicAssetValue) throw new ApiError(404, "Media not found.", undefined, "MEDIA_NOT_FOUND");
    return publicAssetValue;
  }
  return {
    ...asset,
    url: asset.visibility === "PUBLIC" ? `/api/v1/media/${asset.id}/file` : `/api/v1/admin/media/${asset.id}/file`,
  };
}

export async function getMediaForFile(id: string, admin = false) {
  const asset = await prisma.mediaAsset.findFirst({
    where: { id, deletedAt: null, ...(admin ? {} : { visibility: "PUBLIC" }) },
  });
  if (!asset) throw new ApiError(404, "Media not found.", undefined, "MEDIA_NOT_FOUND");
  return asset;
}

export async function resolveMediaDelivery(asset: { id: string; filePath: string; visibility: MediaVisibility; mimeType: string; originalName: string }) {
  const ref = parseStoredRef(asset.filePath);
  const storage = getStorage();
  if (ref.provider === "local") {
    const local = storage.localPath(ref);
    if (!local) throw new ApiError(400, "Invalid media path.", undefined, "INVALID_MEDIA_PATH");
    return { type: "file" as const, path: local };
  }
  if (asset.visibility === "PUBLIC") {
    return { type: "redirect" as const, url: await storage.publicUrl(ref) };
  }
  return { type: "redirect" as const, url: await storage.signedUrl(ref, env.SUPABASE_SIGNED_URL_TTL_SECONDS) };
}

export async function updateMedia(id: string, data: z.infer<typeof mediaUpdateSchema>, _userId: string) {
  const asset = await prisma.mediaAsset.findFirst({ where: { id, deletedAt: null } });
  if (!asset) throw new ApiError(404, "Media not found.", undefined, "MEDIA_NOT_FOUND");
  await prisma.mediaAsset.update({
    where: { id },
    data: { ...data, ...(data.altText === null ? { altText: null } : {}) },
  });
  return getMedia(id, true);
}

export async function deleteMedia(id: string): Promise<{ id: string }> {
  const asset = await prisma.mediaAsset.findFirst({ where: { id, deletedAt: null } });
  if (!asset) throw new ApiError(404, "Media not found.", undefined, "MEDIA_NOT_FOUND");
  const [projectCovers, projectImages, newsFeatured, newsSocial, events, attachments, partnerships] = await Promise.all([
    prisma.project.count({ where: { coverImageId: id } }),
    prisma.projectImage.count({ where: { mediaAssetId: id } }),
    prisma.newsArticle.count({ where: { featuredImageId: id } }),
    prisma.newsArticle.count({ where: { socialImageId: id } }),
    prisma.event.count({ where: { eventImageId: id } }),
    prisma.announcementAttachment.count({ where: { mediaAssetId: id } }),
    prisma.partnershipSubmission.count({ where: { attachmentId: id } }),
  ]);
  if (projectCovers + projectImages + newsFeatured + newsSocial + events + attachments + partnerships > 0) {
    throw new ApiError(409, "This media item is still used by content. Remove those references before deleting it.", undefined, "MEDIA_IN_USE");
  }
  await getStorage().delete(parseStoredRef(asset.filePath)).catch((error) => console.warn("Media storage cleanup failed", error));
  await prisma.mediaAsset.delete({ where: { id } });
  return { id };
}

export function resolveMediaPath(asset: { filePath: string }): string {
  const ref = parseStoredRef(asset.filePath);
  if (ref.provider !== "local") throw new ApiError(400, "Media is not stored locally.", undefined, "INVALID_MEDIA_PATH");
  const absolute = path.resolve(storageRoot(), ref.objectKey);
  const uploadsRoot = path.join(storageRoot(), "uploads") + path.sep;
  if (!absolute.startsWith(uploadsRoot)) {
    throw new ApiError(400, "Invalid media path.", undefined, "INVALID_MEDIA_PATH");
  }
  return absolute;
}
