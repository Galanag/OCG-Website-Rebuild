import type { Prisma } from "../generated/prisma/client.js";

export function parsePagination(query: Record<string, unknown>): {
  page: number;
  limit: number;
  skip: number;
  take: number;
} {
  const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(query.limit ?? "20"), 10) || 20));
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function textSearch(value: string, fields: string[]): Prisma.StringFilter {
  if (!value.trim()) return {};
  return { contains: value.trim() };
}

export function orderByParam(value: unknown, allowed: string[], fallback = "createdAt"): Record<string, "asc" | "desc"> {
  const sort = String(value || "");
  const match = /^(-?)(.+)$/.exec(sort);
  const direction = match?.[1] === "-" ? "desc" : "asc";
  const field = match?.[2] || fallback;
  return { [allowed.includes(field) ? field : fallback]: direction };
}

export function meta(page: number, limit: number, total: number): {
  page: number;
  limit: number;
  total: number;
  pages: number;
} {
  return { page, limit, total, pages: Math.max(0, Math.ceil(total / limit)) };
}

export function asNullableDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

export function asNullableNumber(value: number | null | undefined): number | null {
  return value === undefined || value === null ? null : value;
}