import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema, slugParamSchema, publishSchema } from "../validators/common.js";
import { announcementCreateSchema, announcementUpdateSchema, announcementAttachmentSchema } from "../validators/content.js";
import {
  listAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement,
  setAnnouncementPublished, deleteAnnouncement, getPublicAnnouncement, replaceAnnouncementAttachments,
} from "../controllers/content.controller.js";

export const publicAnnouncementRoutes = Router();
publicAnnouncementRoutes.get("/", asyncHandler(listAnnouncements));
publicAnnouncementRoutes.get("/:slug", validateParams(slugParamSchema), asyncHandler(getPublicAnnouncement));

export const adminAnnouncementRoutes = Router();
adminAnnouncementRoutes.use(requireAuth);
adminAnnouncementRoutes.get("/", requirePermission("content:read"), asyncHandler(listAnnouncements));
adminAnnouncementRoutes.post("/", requirePermission("content:write"), requireCsrfForMutation, validateBody(announcementCreateSchema), asyncHandler(createAnnouncement));
adminAnnouncementRoutes.get("/:id", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(getAnnouncement));
adminAnnouncementRoutes.put("/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(announcementUpdateSchema), asyncHandler(updateAnnouncement));
adminAnnouncementRoutes.post("/:id/publish", requirePermission("content:publish"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(publishSchema), asyncHandler(setAnnouncementPublished));
adminAnnouncementRoutes.put("/:id/attachments", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(announcementAttachmentSchema), asyncHandler(replaceAnnouncementAttachments));
adminAnnouncementRoutes.delete("/:id", requirePermission("content:delete"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(deleteAnnouncement));