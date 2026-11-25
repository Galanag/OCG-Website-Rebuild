# Cloud Migration Audit

**Status:** In progress  
**Branch:** `feat/supabase-postgres-vercel`  
**Date:** 2026-11-25  
**Scope:** Audit only; no destructive migration executed.

## Executive Summary

Audit started. This document captures repository findings, risks, and required changes for migrating OCG-Website-Rebuild from local MariaDB/MySQL + local filesystem storage to Supabase PostgreSQL + persistent object storage + Vercel deployment, while preserving the existing PHP public site, TypeScript/Express/Prisma API, admin SPA, RBAC, CMS behavior, and content.

## 1. Repository Inventory

### Top-level shape
- PHP public site at repository root (`*.php`, `includes/`, `assets/`, `src/`, `storage/`, `uploads/`).
- TypeScript/Express/Prisma API in `backend/`.
- TypeScript admin SPA source in `admin/src/`; built assets committed in `admin/assets/`.
- Existing docs in `docs/`.
- Existing deployment artifacts: `Dockerfile`, `Caddyfile`, `.dockerignore`, `.vercel/` directory present, no `vercel.json`.

### Runtime/tooling observed
- Node: `v22.23.3`
- npm: `10.9.9`
- PHP: `8.5.4` CLI
- Backend dependencies include `@prisma/client@7.10.1`, `prisma@7.10.1`, `@prisma/adapter-mariadb@7.10.1`, `mariadb@^3.5.5`.

## 2. Baseline Verification (audit phase)

| Check | Result | Notes |
|---|---|---|
| `npm run test:php` | PASS | PHP lint passed across root/includes/admin PHP files. |
| `node -v`, `npm -v`, `php -v` | PASS | Node 22.23.3, npm 10.9.9, PHP 8.5.4. |
| `npx prisma validate --schema backend/prisma/schema.prisma` | BLOCKED in current shell | Installed CLI reports Prisma 8 command mismatch; repo pins Prisma 7.10.1. Use `npx --prefix backend prisma validate` or backend-installed Prisma 7 CLI. |
| Backend tests/build/admin build | Pending | To be run during audit/implementation phases with evidence. |

## 3. Current Architecture

### Public website (PHP)
- Bootstrap: `includes/bootstrap.php` loads `includes/config.php` then `includes/functions.php`.
- API integration: `includes/api.php` uses `OCG_API_URL` or same-origin `/api/v1`; caches GET responses in `storage/cache`; posts JSON/multipart to API.
- Sessions: PHP `session_start()` used for flash/CSRF in public forms (`includes/config.php`, `includes/functions.php`).
- Filesystem: `storage/cache`, `storage/partner-uploads`, `uploads/*` exist; `.gitignore` ignores runtime contents.

### API (Express + Prisma)
- Entry: `backend/src/server.ts` calls `app.listen`; not directly Vercel serverless-handler compatible.
- App: `backend/src/app.ts` configures Helmet, CORS allowlist, JSON/urlencoded parsers, cookie parser, rate limit, routes, 404/error handlers.
- Auth: opaque session cookie + CSRF cookie, Argon2id passwords, DB-backed sessions/reset tokens, RBAC permissions, audit logging.
- Prisma: MySQL datasource, `prisma-client` generator output to `src/generated/prisma`, MariaDB adapter in `src/prisma/client.ts`.
- Media: local disk storage under `STORAGE_ROOT/uploads`; DB stores metadata. Public/private file serving through API endpoints.

### Admin SPA
- Static PHP shell `admin/index.php` sets `window.OCG_API_URL`.
- TS client `admin/src/admin.ts` uses same-origin `/api/v1` by default, `credentials: 'include'`, sends `X-CSRF-Token` for mutations.

## 4. Initial Findings / Risks

- **Prisma provider is MySQL** (`schema.prisma`, `migration_lock.toml`, migrations contain MySQL-specific SQL/`LONGTEXT`/`@db.*`).
- **Prisma adapter is MariaDB-specific** (`backend/src/prisma/client.ts`, dependency `@prisma/adapter-mariadb`).
- **Server startup is long-lived listener** (`backend/src/server.ts`) - unsuitable as-is for Vercel serverless function entry.
- **Local filesystem persistence** for media/uploads/cache/partner uploads - incompatible with Vercel ephemeral filesystem.
- **PHP sessions** used on public site for flash/CSRF; acceptable if stateless/serverless-compatible runtime is chosen carefully, but needs verification under FrankenPHP/Vercel.
- **Rate limiting is in-process** (`express-rate-limit` default memory store) - not distributed across serverless instances.
- **Environment validation requires `DATABASE_URL`** and has MySQL-oriented defaults/names; needs Postgres/Supabase-aware config.
- **No `vercel.json`**; existing Docker/Caddy target traditional container deployment.
- **Large working tree already dirty** with prior CMS work; migration must avoid unrelated churn and preserve pre-existing modifications.
- **Sensitive local files present but untracked/ignored**: `backend/.env` exists locally and is ignored; `.env.local` at root is present - audit must confirm not tracked.

## 5. Pending Audit Tasks

- Complete route inventory and Vercel runtime mapping.
- Inspect all Prisma models for Postgres type/UUID/Json/Decimal/DateTime/enum compatibility.
- Inspect upload/submission flows end-to-end.
- Inspect auth/cookie/CORS/CSRF behavior for cross-project deployment.
- Inspect Supabase target state safely (no secrets, no destructive commands).
- Run backend/admin builds and tests; capture evidence.
- Finalize deployability matrix and required env vars.


## 6. Build/Test Evidence (audit phase)

| Check | Result | Evidence |
|---|---|---|
| `npm run test:php` | PASS | All PHP files linted clean. |
| `npm run build` (root public CSS+JS) | PASS | Tailwind + TS build completed. |
| `npm run build:admin` | PASS | Admin Tailwind + TS build completed. |
| `cd backend && npm run typecheck` | PASS | `tsc --noEmit` clean. |
| `cd backend && npx prisma validate` | PASS | Prisma 7 schema valid. |
| Backend Vitest suite | Pending | Requires DB/test env; run after migration strategy is defined. |

## 7. MySQL/MariaDB-Specific Inventory

### Prisma schema
- `datasource db.provider = "mysql"` and `migration_lock.toml provider = "mysql"`.
- 182 `@db.*` annotations: `@db.VarChar`, `@db.LongText`, `@db.Text`, `@db.Decimal`.
- String IDs stored as `@db.VarChar(36)` with `uuid()` defaults; Postgres should prefer `@db.Uuid` or `text/uuid` mapping consistently.
- `Json` fields present (roles.permissions, audit metadata, settings, news tags, page section metadata) - Postgres compatible but behavior/indexing differs.
- `Decimal` fields used for lat/long/contract/tender values - compatible with Postgres `Decimal`.
- DateTime fields used throughout - review timezone/storage semantics.

### Prisma client/runtime
- `backend/src/prisma/client.ts` imports `@prisma/adapter-mariadb` and parses MySQL URL parts/default port 3306.
- `backend/package.json` depends on `@prisma/adapter-mariadb` and `mariadb`.
- `backend/prisma.config.ts` has only `DATABASE_URL`; Prisma 7 Postgres/Supabase often needs direct URL for migrations.

### SQL/migrations
- Existing migrations are MySQL SQL (`LONGTEXT`, MySQL DDL). Cannot be applied to Postgres.
- Migration history includes 4 applied migrations; fresh Postgres migration baseline required, but existing MySQL migration history must be preserved in repo for audit/history unless intentionally archived.

### Query behavior risks
- Many `contains` filters in services; in MySQL default collation often case-insensitive, Postgres `contains` is case-sensitive unless `mode: 'insensitive'` or citext/collation strategy used. Must audit user-facing search behavior.
- No raw SQL `$queryRaw/$executeRaw` found in source (only generated Prisma types mention them).
- Transactions used (`$transaction`) - supported in Postgres.

## 8. Filesystem/Persistence Risks (Vercel Ephemeral FS)

- `backend/src/services/media.service.ts` writes uploads to local `STORAGE_ROOT/uploads/images|documents` and deletes with `unlink`.
- `backend/src/services/media.service.ts` serves files via `res.sendFile` from local disk.
- Public PHP caches API responses to `storage/cache/*.json` via `file_put_contents`.
- `storage/partner-uploads` exists; partnership flow currently uploads through API/media service as private MediaAsset? (audit detail: submission controller uploads attachment via `uploadMedia(..., "PRIVATE", null, ...)` and stores attachmentId).
- Vercel serverless/container deployments have ephemeral filesystem; persistent uploads/cache must move to Supabase Storage/object storage or external persistent volume. Cache should be memory/edge-safe or optional.

## 9. Auth/Session/CORS Risks

- API uses cookie-based sessions + CSRF cookie; same-origin deployment simplest. Two Vercel projects (website + api) create cross-site cookie/CORS/CSRF complexity.
- `SameSite=Lax`, `httpOnly` session cookie, non-httpOnly CSRF cookie. Cross-origin/subdomain deployment requires careful cookie domain/SameSite/Secure and CORS credentials.
- Rate limiting is in-memory; serverless instances do not share limits.
- PHP public site has its own PHP session for flash/CSRF on forms; separate from API session.

## 10. Vercel Runtime Findings

- Existing `Dockerfile` uses FrankenPHP/Caddy for PHP site - aligns with Vercel Dockerfile/FrankenPHP approach for `ocg-website`.
- Backend `server.ts` uses `app.listen` and process signal handlers; Vercel Node/Express deployment expects exported app/handler and no persistent listener in serverless mode.
- No `vercel.json` files present.
- Admin is built static assets served by PHP/admin index; can be included in website deployment or served separately.

## 11. Supabase/Environment Unknowns (need safe inspection / user-provided secrets)

- Supabase project ref provided: `rnjcwjcbqhvykbidnqef`.
- No credentials available in repo; must use env vars and Supabase MCP/read-only inspection if available.
- Need to confirm existing Supabase DB state before any migration.
- Need pooled connection string for Prisma runtime and direct/session connection for migrations, depending on Prisma adapter.

## 12. Deployment Blockers / Required Changes

1. Migrate Prisma datasource/adapter/client/config from MySQL/MariaDB to PostgreSQL/Supabase.
2. Replace MySQL-specific schema types/annotations and regenerate migrations for Postgres.
3. Replace local media storage with Supabase Storage or equivalent persistent storage; update file serving and deletion.
4. Make backend exportable for Vercel serverless/Node runtime; gate `listen` for local/dev.
5. Make cache/stateless behavior safe on ephemeral FS.
6. Define env var matrix and startup validation for local/preview/prod.
7. Verify Supabase DB is empty or plan data migration from MariaDB without destructive operations.
8. Add Vercel config/docs for two-project setup.

## 13. Safe Next Actions

- Inspect Supabase project safely via available tools/env without exposing secrets.
- Create Postgres-compatible Prisma schema draft and migration plan.
- Design storage abstraction (local dev + Supabase Storage prod).
- Keep all changes on `feat/supabase-postgres-vercel`; no main push.
