import { z } from "zod";

export const uuidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "Invalid identifier");
export const slugSchema = z.string().trim().min(1).max(240).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");
export const emailSchema = z.string().trim().email().max(190);
export const shortText = (max = 200) => z.string().trim().min(1).max(max);
export const optionalText = (max = 500) => z.string().trim().max(max).optional().nullable().transform((value) => value || null);
export const richText = z.string().trim().max(100_000);
export const optionalRichText = z.string().trim().max(100_000).optional().nullable().transform((value) => value ?? "");
export const booleanInput = z.union([z.boolean(), z.enum(["true", "false"]).transform((value) => value === "true")]);
export const dateInput = z.coerce.date();
export const optionalDate = dateInput.nullable().optional();
export const optionalUuid = uuidSchema.nullable().optional().transform((value) => value || undefined);
export const optionalNumber = z.coerce.number().finite().optional().nullable().transform((value) => value ?? null);
export const progressSchema = z.coerce.number().int().min(0).max(100);
export const optionalProgress = progressSchema.optional().nullable().transform((value) => value ?? null);
export const currencySchema = z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Use a three-letter ISO 4217 currency code");
export const urlSchema = z.union([
  z.literal(""),
  z.string().trim().url().max(1000),
]).optional().nullable().transform((value) => value || null);
export const tagsSchema = z.array(z.string().trim().min(1).max(50)).max(30).optional().default([]);

export const consentSchema = z.union([
  z.literal(true),
  z.literal("1"),
  z.literal("true"),
  z.literal("on"),
]).transform(() => true);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(200).optional(),
  sort: z.string().trim().max(80).optional(),
});

export const idParamSchema = z.object({ id: uuidSchema });
export const slugParamSchema = z.object({ slug: slugSchema });
export const resourceParamSchema = z.object({ resource: z.enum(["contact", "partnership", "survey"]) });
export const booleanQuery = z.enum(["true", "false"]).optional().transform((value) => value === "true");
export const optionalBoolean = booleanInput.optional().nullable().transform((value) => value ?? undefined);
export const publishSchema = z.object({ published: booleanInput });