import { Router } from "express";
import { asyncHandler } from "../utils/http.js";
import { validateBody } from "../middleware/validation.js";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../validators/auth.js";
import { requireAuth, requireCsrfForMutation } from "../middleware/auth.middleware.js";
import { rateLimit } from "express-rate-limit";
import {
  login, logout, me, forgotPassword, resetPasswordHandler, changePassword,
} from "../controllers/auth.controller.js";

export const authRoutes = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many attempts. Please try again later." } },
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many reset attempts. Please try again later." } },
});

authRoutes.post("/login", loginLimiter, validateBody(loginSchema), asyncHandler(login));
authRoutes.post("/logout", requireAuth, requireCsrfForMutation, asyncHandler(logout));
authRoutes.get("/me", requireAuth, asyncHandler(me));
authRoutes.post("/forgot-password", resetLimiter, validateBody(forgotPasswordSchema), asyncHandler(forgotPassword));
authRoutes.post("/reset-password", resetLimiter, validateBody(resetPasswordSchema), asyncHandler(resetPasswordHandler));
authRoutes.post("/change-password", requireAuth, requireCsrfForMutation, validateBody(changePasswordSchema), asyncHandler(changePassword));