import { z } from "zod";
import {
  booleanInput, consentSchema, currencySchema, dateInput, emailSchema, optionalDate, optionalNumber,
  optionalProgress, optionalRichText, optionalText, optionalUuid, progressSchema, richText, shortText,
  slugSchema, tagsSchema, urlSchema, uuidSchema,
} from "./common.js";

export const projectStatus = z.enum([
  "PROPOSED", "PLANNING", "TENDERING", "AWARDED", "STARTED", "ONGOING", "ON_HOLD", "COMPLETED", "CANCELLED",
]);

const projectFields = z.object({
  reference: shortText(80).optional(),
  title: shortText(200),
  slug: slugSchema.optional(),
  shortDescription: optionalText(600),
  description: optionalRichText,
  category: optionalText(120),
  constructionSector: optionalText(120),
  client: optionalText(200),
  contractor: optionalText(200),
  consultant: optionalText(200),
  location: shortText(200).optional(),
  region: optionalText(120),
  country: z.string().trim().min(1).max(100).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable().transform((value) => value ?? null),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable().transform((value) => value ?? null),
  contractValue: z.coerce.number().min(0).optional().nullable().transform((value) => value ?? null),
  currency: currencySchema.optional(),
  fundingSource: optionalText(200),
  contractType: optionalText(120),
  startDate: optionalDate,
  plannedCompletionDate: optionalDate,
  actualCompletionDate: optionalDate,
  progress: progressSchema.optional(),
  financialProgress: optionalProgress,
  projectManager: optionalText(160),
  coverImageId: optionalUuid,
  galleryMediaIds: z.array(uuidSchema).max(50).optional(),
  attachmentIds: z.array(uuidSchema).max(30).optional(),
  status: projectStatus.optional(),
  featured: booleanInput.optional(),
  published: booleanInput.optional(),
});

export const projectCreateSchema = projectFields;
export const projectUpdateSchema = projectFields.partial();
export const projectStatusSchema = z.object({
  status: projectStatus,
  note: optionalText(500),
});

export const announcementCategory = z.enum([
  "JOB_VACANCY", "BID_TENDER", "PROCUREMENT_NOTICE", "EXPRESSION_OF_INTEREST",
  "CONTRACT_AWARD", "GENERAL_NOTICE", "TRAINING", "OTHER",
]);

const announcementFields = z.object({
  title: shortText(220),
  slug: slugSchema.optional(),
  category: announcementCategory,
  reference: optionalText(100),
  summary: optionalText(700),
  content: optionalRichText,
  applicationInstructions: optionalText(20_000),
  externalApplicationUrl: urlSchema,
  featured: booleanInput.optional(),
  published: booleanInput.optional(),
  publishedAt: optionalDate,
  scheduledFor: optionalDate,
  deadline: optionalDate,
  positionTitle: optionalText(200),
  department: optionalText(150),
  vacancyCount: z.coerce.number().int().min(0).optional().nullable().transform((value) => value ?? null),
  requiredQualifications: optionalText(20_000),
  experienceRequirements: optionalText(20_000),
  employmentType: optionalText(100),
  dutyStation: optionalText(200),
  tenderReference: optionalText(100),
  tenderTitle: optionalText(220),
  procurementCategory: optionalText(150),
  eligibilityRequirements: optionalText(20_000),
  scopeOfWork: optionalText(20_000),
  submissionDeadline: optionalDate,
  bidOpeningInformation: optionalText(500),
  submissionInstructions: optionalText(20_000),
  contactInformation: optionalText(500),
  salaryRange: optionalText(200),
  responsibilities: optionalText(20_000),
  tenderValue: z.coerce.number().min(0).optional().nullable().transform((value) => value ?? null),
  currency: currencySchema.optional(),
  submissionLocation: optionalText(300),
  openingDate: optionalDate,
  contactPerson: optionalText(160),
  attachmentIds: z.array(uuidSchema).max(30).optional(),
});

export const announcementCreateSchema = announcementFields.superRefine((value, context) => {
  if (value.category === "JOB_VACANCY" && !value.positionTitle?.trim()) {
    context.addIssue({ code: "custom", path: ["positionTitle"], message: "Position title is required for a vacancy." });
  }
  if (value.category === "BID_TENDER" && !value.procurementCategory?.trim()) {
    context.addIssue({ code: "custom", path: ["procurementCategory"], message: "Procurement category is required for a tender." });
  }
});
export const announcementUpdateSchema = announcementFields.partial();

const newsFields = z.object({
  title: shortText(220),
  slug: slugSchema.optional(),
  summary: optionalText(700),
  content: optionalRichText,
  category: optionalText(120),
  tags: tagsSchema,
  featuredImageId: optionalUuid,
  socialImageId: optionalUuid,
  galleryMediaIds: z.array(uuidSchema).max(20).optional(),
  seoTitle: optionalText(220),
  seoDescription: optionalText(350),
  authorName: optionalText(160),
  published: booleanInput.optional(),
  publishedAt: optionalDate,
  scheduledFor: optionalDate,
  featured: booleanInput.optional(),
});

export const newsCreateSchema = newsFields;
export const newsUpdateSchema = newsFields.partial();

const eventFields = z.object({
  title: shortText(220),
  slug: slugSchema.optional(),
  description: optionalRichText,
  category: optionalText(120),
  eventImageId: optionalUuid,
  startsAt: optionalDate,
  endsAt: optionalDate,
  location: optionalText(300),
  onlineMeetingUrl: urlSchema,
  registrationUrl: urlSchema,
  organizer: optionalText(200),
  contactInfo: optionalText(500),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  published: booleanInput.optional(),
  publishedAt: optionalDate,
  featured: booleanInput.optional(),
});

export const eventCreateSchema = eventFields;
export const eventUpdateSchema = eventFields.partial();

export const mediaUploadSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional().default("PUBLIC"),
  altText: optionalText(300),
  description: optionalText(1000),
});

export const mediaUpdateSchema = z.object({
  altText: optionalText(300),
  description: optionalText(1000),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export const galleryUpdateSchema = z.object({
  mediaIds: z.array(uuidSchema).min(1).max(50),
});

export const announcementAttachmentSchema = z.object({
  mediaIds: z.array(uuidSchema).min(1).max(30),
});

export const contactSchema = z.object({
  firstName: shortText(80),
  lastName: shortText(80),
  email: emailSchema,
  phone: optionalText(40),
  subject: z.string().trim().max(160).optional().default("General enquiry"),
  message: z.string().trim().min(1).max(2500),
  consent: consentSchema,
  website: z.string().max(200).optional(),
});

export const partnershipSchema = z.object({
  firstName: shortText(80),
  lastName: shortText(80),
  organization: shortText(180),
  email: emailSchema,
  phone: optionalText(40),
  country: optionalText(100),
  partnerType: z.string().trim().min(1).max(120),
  organizationWebsite: urlSchema,
  notes: z.string().trim().min(1).max(2500),
  consent: consentSchema,
  website: z.string().max(200).optional(),
});

export const surveySchema = z.object({
  name: optionalText(100),
  email: emailSchema.optional(),
  area: shortText(100),
  rating: z.enum(["Very good", "Good", "Average", "Poor", "Very poor"]),
  feedback: z.string().trim().min(1).max(2000),
  website: z.string().max(200).optional(),
});

export const pageSectionCreateSchema = z.object({
  pageKey: z.string().trim().min(1).max(80),
  sectionKey: z.string().trim().min(1).max(100),
  title: shortText(220),
  content: z.string().max(200_000).optional().default(""),
  metadata: z.unknown().optional(),
  imageId: optionalUuid,
  sortOrder: z.coerce.number().int().min(0).optional(),
  published: booleanInput.optional(),
});
export const pageSectionUpdateSchema = pageSectionCreateSchema.partial();

export const submissionStatusSchema = z.object({ status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]) });
export const submissionUpdateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]).optional(),
  reviewedById: uuidSchema.optional(),
});