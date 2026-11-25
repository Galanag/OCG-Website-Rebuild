import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../utils/http.js";
import { env } from "../config/env.js";
import { sameOrigin } from "../middleware/security.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema, resourceParamSchema } from "../validators/common.js";
import {
  contactSchema, partnershipSchema, surveySchema, submissionStatusSchema,
} from "../validators/content.js";
import { rateLimit } from "express-rate-limit";
import {
  contact, partnership, survey, list, get, updateStatus,
} from "../controllers/submission.controller.js";

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many submissions. Please try again later." } },
});

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.UPLOAD_MAX_BYTES, files: 1 },
});

export const publicSubmissionRoutes = Router();
publicSubmissionRoutes.post("/contact", submissionLimiter, sameOrigin, validateBody(contactSchema), asyncHandler(contact));
publicSubmissionRoutes.post("/partnership", submissionLimiter, sameOrigin, uploadMiddleware.single("attachment"), validateBody(partnershipSchema), asyncHandler(partnership));
publicSubmissionRoutes.post("/survey", submissionLimiter, sameOrigin, validateBody(surveySchema), asyncHandler(survey));

export const adminSubmissionRoutes = Router();
adminSubmissionRoutes.use(requireAuth);
adminSubmissionRoutes.get("/:resource", requirePermission("submissions:read"), validateParams(resourceParamSchema), asyncHandler(list));
adminSubmissionRoutes.get("/:resource/:id", requirePermission("submissions:read"), validateParams(resourceParamSchema.extend(idParamSchema.shape)), asyncHandler(get));
adminSubmissionRoutes.patch("/:resource/:id/status", requirePermission("submissions:read"), requireCsrfForMutation, validateParams(resourceParamSchema.extend(idParamSchema.shape)), validateBody(submissionStatusSchema), asyncHandler(updateStatus));