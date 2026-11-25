import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import { requireAuth, requireCsrfForMutation, requirePermission } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { idParamSchema } from "../validators/common.js";
import {
  userCreateSchema, userUpdateSchema, passwordResetByAdminSchema, roleCreateSchema, settingsSchema,
} from "../validators/auth.js";
import { pageSectionCreateSchema, pageSectionUpdateSchema } from "../validators/content.js";
import {
  dashboard, listUsers, getUser, createUser, updateUser, deleteUser, resetUserPassword,
  listRoles, createRole, listSettings, updateSetting, auditLogs,
  listPageSections, getPageSection, createPageSection, updatePageSection, deletePageSection,
} from "../controllers/admin.controller.js";

export const adminRoutes = Router();
adminRoutes.use(requireAuth);
adminRoutes.get("/stats", requirePermission("content:read"), asyncHandler(dashboard));
adminRoutes.get("/users", requirePermission("users:manage"), asyncHandler(listUsers));
adminRoutes.post("/users", requirePermission("users:manage"), requireCsrfForMutation, validateBody(userCreateSchema), asyncHandler(createUser));
adminRoutes.get("/users/:id", requirePermission("users:manage"), validateParams(idParamSchema), asyncHandler(getUser));
adminRoutes.put("/users/:id", requirePermission("users:manage"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(userUpdateSchema), asyncHandler(updateUser));
adminRoutes.delete("/users/:id", requirePermission("users:manage"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(deleteUser));
adminRoutes.post("/users/:id/reset-password", requirePermission("users:manage"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(passwordResetByAdminSchema), asyncHandler(resetUserPassword));
adminRoutes.get("/roles", requirePermission("roles:manage"), asyncHandler(listRoles));
adminRoutes.post("/roles", requirePermission("roles:manage"), requireCsrfForMutation, validateBody(roleCreateSchema), asyncHandler(createRole));
adminRoutes.get("/settings", requirePermission("settings:manage"), asyncHandler(listSettings));
adminRoutes.put("/settings", requirePermission("settings:manage"), requireCsrfForMutation, validateBody(settingsSchema), asyncHandler(updateSetting));
adminRoutes.get("/audit-logs", requirePermission("audit:read"), asyncHandler(auditLogs));
adminRoutes.get("/page-sections", requirePermission("content:read"), asyncHandler(listPageSections));
adminRoutes.get("/page-sections/:id", requirePermission("content:read"), validateParams(idParamSchema), asyncHandler(getPageSection));
adminRoutes.post("/page-sections", requirePermission("content:write"), requireCsrfForMutation, validateBody(pageSectionCreateSchema), asyncHandler(createPageSection));
adminRoutes.put("/page-sections/:id", requirePermission("content:write"), requireCsrfForMutation, validateParams(idParamSchema), validateBody(pageSectionUpdateSchema), asyncHandler(updatePageSection));
adminRoutes.delete("/page-sections/:id", requirePermission("content:delete"), requireCsrfForMutation, validateParams(idParamSchema), asyncHandler(deletePageSection));