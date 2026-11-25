import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema, slugParamSchema, publishSchema } from "../validators/common.js";
import {
  projectCreateSchema, projectUpdateSchema, projectStatusSchema,
  galleryUpdateSchema,
} from "../validators/content.js";
import {
  listProjects, getProject, createProject, updateProject, updateProjectStatus,
  setProjectPublished, deleteProject, replaceProjectGallery, removeProjectImage, getPublicProject,
  replaceProjectAttachments,
} from "../controllers/content.controller.js";

export const publicProjectRoutes = Router();
publicProjectRoutes.get("/", asyncHandler(listProjects));
publicProjectRoutes.get("/:slug", validateParams(slugParamSchema), asyncHandler(getPublicProject));

export const adminProjectRoutes = Router();
adminProjectRoutes.use(requireAuth);
adminProjectRoutes.get("/", requirePermission("content:read"), asyncHandler(listProjects));
adminProjectRoutes.post("/", requirePermission("content:write"), requireCsrfForMutation, validateBody(projectCreateSchema), asyncHandler(createProject));
adminProjectRoutes.get("/:id", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(getProject));
adminProjectRoutes.put("/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(projectUpdateSchema), asyncHandler(updateProject));
adminProjectRoutes.patch("/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(projectUpdateSchema), asyncHandler(updateProject));
adminProjectRoutes.post("/:id/status", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(projectStatusSchema), asyncHandler(updateProjectStatus));
adminProjectRoutes.post("/:id/publish", requirePermission("content:publish"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(publishSchema), asyncHandler(setProjectPublished));
adminProjectRoutes.put("/:id/gallery", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(galleryUpdateSchema), asyncHandler(replaceProjectGallery));
adminProjectRoutes.put("/:id/attachments", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(galleryUpdateSchema), asyncHandler(replaceProjectAttachments));
adminProjectRoutes.delete("/:id/gallery/:imageId", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema.extend({ imageId: idParamSchema.shape.id })), asyncHandler(removeProjectImage));
adminProjectRoutes.delete("/:id", requirePermission("content:delete"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(deleteProject));