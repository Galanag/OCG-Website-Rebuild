import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema, slugParamSchema, publishSchema } from "../validators/common.js";
import { newsCreateSchema, newsUpdateSchema, galleryUpdateSchema } from "../validators/content.js";
import {
  listNews, getNews, createNews, updateNews, setNewsPublished, deleteNews, getPublicNews, replaceNewsGallery,
} from "../controllers/content.controller.js";

export const publicNewsRoutes = Router();
publicNewsRoutes.get("/", asyncHandler(listNews));
publicNewsRoutes.get("/:slug", validateParams(slugParamSchema), asyncHandler(getPublicNews));

export const adminNewsRoutes = Router();
adminNewsRoutes.use(requireAuth);
adminNewsRoutes.get("/", requirePermission("content:read"), asyncHandler(listNews));
adminNewsRoutes.post("/", requirePermission("content:write"), requireCsrfForMutation, validateBody(newsCreateSchema), asyncHandler(createNews));
adminNewsRoutes.get("/:id", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(getNews));
adminNewsRoutes.put("/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(newsUpdateSchema), asyncHandler(updateNews));
adminNewsRoutes.post("/:id/publish", requirePermission("content:publish"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(publishSchema), asyncHandler(setNewsPublished));
adminNewsRoutes.put("/:id/gallery", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(galleryUpdateSchema), asyncHandler(replaceNewsGallery));
adminNewsRoutes.delete("/:id", requirePermission("content:delete"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(deleteNews));