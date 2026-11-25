import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../utils/http.js";
import { env } from "../config/env.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema } from "../validators/common.js";
import { mediaUploadSchema, mediaUpdateSchema } from "../validators/content.js";
import {
  upload, list, get, update, remove, file,
} from "../controllers/media.controller.js";

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.UPLOAD_MAX_BYTES, files: 1 },
});

export const publicMediaRoutes = Router();
publicMediaRoutes.get("/", asyncHandler(list));
publicMediaRoutes.get("/:id", validateParams(idParamSchema), asyncHandler(get));
publicMediaRoutes.get("/:id/file", validateParams(idParamSchema), asyncHandler(file));

export const adminMediaRoutes = Router();
adminMediaRoutes.use(requireAuth);
adminMediaRoutes.get("/", requirePermission("content:read"), asyncHandler(list));
adminMediaRoutes.post("/", requirePermission("media:write"), requireCsrfForMutation, uploadMiddleware.single("file"), validateBody(mediaUploadSchema), asyncHandler(upload));
adminMediaRoutes.get("/:id", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(get));
adminMediaRoutes.put("/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(mediaUpdateSchema), asyncHandler(update));
adminMediaRoutes.get("/:id/file", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(file));
adminMediaRoutes.delete("/:id", requirePermission("content:delete"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(remove));