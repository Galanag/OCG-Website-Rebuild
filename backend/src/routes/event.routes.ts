import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema, slugParamSchema, publishSchema } from "../validators/common.js";
import { eventCreateSchema, eventUpdateSchema } from "../validators/content.js";
import {
  listEvents, getEvent, createEvent, updateEvent, setEventPublished, deleteEvent, getPublicEvent,
} from "../controllers/content.controller.js";

export const publicEventRoutes = Router();
publicEventRoutes.get("/", asyncHandler(listEvents));
publicEventRoutes.get("/:slug", validateParams(slugParamSchema), asyncHandler(getPublicEvent));

export const adminEventRoutes = Router();
adminEventRoutes.use(requireAuth);
adminEventRoutes.get("/", requirePermission("content:read"), asyncHandler(listEvents));
adminEventRoutes.post("/", requirePermission("content:write"), requireCsrfForMutation, validateBody(eventCreateSchema), asyncHandler(createEvent));
adminEventRoutes.get("/:id", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(getEvent));
adminEventRoutes.put("/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(eventUpdateSchema), asyncHandler(updateEvent));
adminEventRoutes.post("/:id/publish", requirePermission("content:publish"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(publishSchema), asyncHandler(setEventPublished));
adminEventRoutes.delete("/:id", requirePermission("content:delete"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(deleteEvent));