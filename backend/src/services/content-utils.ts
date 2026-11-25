import type { MediaAsset } from "../generated/prisma/client.js";

export function publicAsset<T extends MediaAsset>(asset: T | null): {
  id: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  kind: string;
  visibility: string;
  altText: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  url: string;
} | null {
  if (!asset || asset.deletedAt || asset.visibility !== "PUBLIC") return null;
  return {
    id: asset.id,
    originalName: asset.originalName,
    mimeType: asset.mimeType,
    extension: asset.extension,
    size: asset.size,
    kind: asset.kind,
    visibility: asset.visibility,
    altText: asset.altText ?? null,
    description: asset.description ?? null,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
    url: `/api/v1/media/${asset.id}/file`,
  };
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240) || `item-${Date.now()}`;
}

export function publicMediaUrl(asset: unknown): string {
  if (!asset || typeof asset !== "object") return "";
  const value = asset as { id?: string; url?: string };
  return value.url || (value.id ? `/api/v1/media/${value.id}/file` : "");
}

export function withMediaUrl<T extends { id: string; url?: string }>(asset: T): T & { url: string } {
  return { ...asset, url: publicMediaUrl(asset) };
}

export function publicMediaAsset(asset: MediaAsset | null): (MediaAsset & { url: string }) | null {
  if (!asset || asset.deletedAt || asset.visibility !== "PUBLIC") return null;
  return { ...asset, url: `/api/v1/media/${asset.id}/file` };
}

export function sortDirections(value: unknown, allowed: string[], fallback = "createdAt"): Record<string, "asc" | "desc"> {
  const sort = String(value || "");
  const match = /^(-?)(.+)$/.exec(sort);
  const direction = match?.[1] === "-" ? "desc" : "asc";
  const field = match?.[2] || fallback;
  return { [allowed.includes(field) ? field : fallback]: direction };
}

export function parsePositiveInteger(value: unknown, fallback: number, max = 100): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}