# Architecture

## Overview

OCG is a two-application system with a shared persistent MySQL/MariaDB database:

1. **Public PHP website** — the existing PHP pages, Tailwind assets and legacy content. It renders public content through a small server-side API client and falls back to the original static records when the API is unavailable.
2. **TypeScript API** — an Express 5 application under `backend/` that owns authentication, authorization, validation, Prisma persistence, media validation and public/admin content endpoints.
3. **Admin SPA** — a PHP-served TypeScript single-page application under `admin/`. It talks to the same API and uses HTTP-only session cookies plus a CSRF header for mutations.

```text
Visitor / Administrator
          │
          ├── PHP public pages ──HTTP JSON──> Express API /api/v1 ──> Prisma ──> MariaDB
          │        │                              │
          │        └── legacy static fallback      ├── local uploads/
          │                                         └── audit/session tables
          └── Admin SPA (TypeScript) ──HTTP JSON──> Express API /api/v1/admin/*
```

## Layer responsibilities

### Public PHP

- `includes/config.php` — site constants, mail defaults, upload limits and PHP session cookie settings.
- `includes/functions.php` — escaping, CSRF, mail fallback, storage paths and shared bootstrap.
- `includes/api.php` — URL construction, JSON/multipart transport, short-lived filesystem cache and stale-cache fallback.
- `includes/components.php` — reusable project, announcement, news and event cards.
- `includes/data.php` — preserved legacy content and the shared include chain.
- `*.php` — public pages and detail routes.

The public site never reads MySQL directly. This keeps PHP hosting compatible with shared cPanel and ensures the API remains the single authorization boundary.

### API

```text
backend/src/
├── config/       # environment and role permission definitions
├── controllers/  # HTTP request/response adapters
├── middleware/   # auth, CSRF, validation, origin checks
├── routes/       # public and admin Express routers
├── services/     # business rules and Prisma access
├── validators/   # Zod schemas
├── utils/        # errors, HTTP, sanitize, query, security helpers
└── prisma/       # Prisma client and MariaDB adapter
```

Public routers force `published = true` and exclude soft-deleted records. Admin routers are mounted separately and protected by `requireAuth`, `requireCsrfForMutation`, and permission middleware. A client cannot make a public route return drafts by adding a query parameter.

### Admin

The admin is a compiled TypeScript SPA. It is deliberately not a second authorization system: it renders controls based on `/auth/me` permissions, but the API independently checks every protected endpoint. All dynamic values are escaped before insertion into the DOM; rich text is sanitized by the API and rendered as HTML only in controlled preview/detail contexts.

## Request flows

### Public content

1. PHP page calls `ocg_api_content('projects', [...])`.
2. The API returns only published, non-deleted records.
3. PHP caches the response for 30 seconds by default.
4. If the API is unavailable, PHP uses the last cache entry or the preserved legacy data.

### Admin login

1. `POST /api/v1/auth/login` validates credentials and verifies an Argon2id hash.
2. The API creates a database session and returns an opaque session token plus a CSRF token.
3. The session cookie is HttpOnly; the CSRF cookie is readable by the SPA.
4. Subsequent requests send the session cookie automatically. Mutations also send `X-CSRF-Token`, which must match the cookie and the hashed value stored in the session.

### Content publication

- Draft records are admin-only.
- Publishing sets `publishedAt` when `published` changes to true.
- Unpublishing clears `publishedAt` and removes the record from public routes.
- Project status changes write `ProjectStatusHistory` with previous status, new status, actor and timestamp.
- Announcements derive `OPEN`, `CLOSED`, or `UPCOMING` from their deadlines/schedule rather than deleting expired records.

### Uploads

1. Admin submits multipart form data to `/api/v1/admin/media`.
2. Multer stores the file in memory with a configured size limit.
3. `file-type` checks the actual bytes, not only the extension or declared MIME type.
4. The API generates a random filename and writes to `uploads/images` or `uploads/documents`.
5. Metadata is stored in `MediaAsset`; file bytes are never stored in MySQL.
6. Public files are downloadable through `/api/v1/media/:id/file`; private files require an authenticated admin session.

## Deployment topology

The preferred production topology is a same-origin reverse proxy:

```text
https://ocg.example/
├── PHP public pages
├── /admin/       -> PHP admin shell
└── /api/v1/*     -> Node.js application
```

If cPanel cannot mount the Node application at `/api/v1`, use an API subdomain and configure `API_PUBLIC_URL`, `CORS_ORIGINS`, `PUBLIC_APP_URL`, and the PHP `OCG_API_URL`. Exact steps are in `DEPLOYMENT-YEGARA.md`.

## Architectural decisions and limits

- MySQL/MariaDB is required by the specification; the API uses Prisma's MariaDB adapter and discrete connection settings.
- Local `uploads/` storage is intentional for shared hosting. A future multi-server deployment should replace it with object storage and a shared cache.
- Rate limiting is in-process. A multi-process Node deployment should move to a shared limiter such as Redis.
- The public PHP fallback is content-only. Form submissions require the API; if it is unavailable, the original mail fallback remains.
- The admin SPA has no server-side HTML rendering. It is a protected application shell; all data access is still API-authorized.
- The actual Yegara cPanel Node version, Apache reverse-proxy capability, outbound mail configuration and TLS certificate must be verified during deployment. Local tests are not a production deployment.