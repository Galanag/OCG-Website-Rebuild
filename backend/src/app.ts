import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import { ApiError, errorResponse } from "./utils/errors.js";
import { asyncHandler } from "./utils/http.js";
import { authRoutes } from "./routes/auth.routes.js";
import { publicProjectRoutes, adminProjectRoutes } from "./routes/project.routes.js";
import { publicAnnouncementRoutes, adminAnnouncementRoutes } from "./routes/announcement.routes.js";
import { publicNewsRoutes, adminNewsRoutes } from "./routes/news.routes.js";
import { publicEventRoutes, adminEventRoutes } from "./routes/event.routes.js";
import { publicMediaRoutes, adminMediaRoutes } from "./routes/media.routes.js";
import { publicSubmissionRoutes, adminSubmissionRoutes } from "./routes/submission.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { publicSettings, publicStats, listPageSections } from "./controllers/admin.controller.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin) || origin === env.PUBLIC_APP_URL || origin === env.API_PUBLIC_URL) {
      callback(null, true);
      return;
    }
    callback(new ApiError(403, "This origin is not allowed to call the API.", undefined, "ORIGIN_NOT_ALLOWED"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many API requests. Please try again later." } },
});
app.use("/api/v1", apiLimiter);

app.get("/api/v1/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "ocg-cms-api",
    version: "1.0.0",
    time: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", publicProjectRoutes);
app.use("/api/v1/announcements", publicAnnouncementRoutes);
app.use("/api/v1/news", publicNewsRoutes);
app.use("/api/v1/events", publicEventRoutes);
app.use("/api/v1/media", publicMediaRoutes);
app.use("/api/v1/settings", asyncHandler(publicSettings));
app.get("/api/v1/stats", asyncHandler(publicStats));
app.get("/api/v1/page-sections", asyncHandler(listPageSections));
app.use("/api/v1", publicSubmissionRoutes);

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/projects", adminProjectRoutes);
app.use("/api/v1/admin/announcements", adminAnnouncementRoutes);
app.use("/api/v1/admin/news", adminNewsRoutes);
app.use("/api/v1/admin/events", adminEventRoutes);
app.use("/api/v1/admin/media", adminMediaRoutes);
app.use("/api/v1/admin/submissions", adminSubmissionRoutes);

app.use((request, response) => {
  response.status(404).json({
    error: { code: "NOT_FOUND", message: `Route ${request.method} ${request.originalUrl} was not found.` },
  });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const result = errorResponse(error);
  if (result.status >= 500) console.error(error);
  if (response.headersSent) return;
  response.status(result.status).json(result.body);
});