# Production Readiness

## Status: NOT production-ready

This migration work is in progress on `feat/supabase-postgres-vercel`. Do not claim production readiness until live Supabase, live Vercel deployments, and end-to-end tests pass.

## Completed in this pass (code-level)

- Prisma datasource moved from MySQL to PostgreSQL in `schema.prisma`; MySQL `@db.*` annotations converted to Postgres-compatible types (`@db.Uuid`, `@db.Text`, etc.).
- Prisma client adapter migrated from `@prisma/adapter-mariadb` to `@prisma/adapter-pg` + `pg` pool.
- `prisma.config.ts` configured for `DIRECT_URL` (migrations) and schema path.
- Old MySQL migrations archived under `backend/prisma/migrations_mysql_archive/`; PostgreSQL baseline migration generated at `backend/prisma/migrations/20261125000000_postgres_baseline/migration.sql`.
- Env validation extended for `DIRECT_URL`, storage provider, Supabase vars.
- Storage abstraction added (`local`/`supabase`) in `backend/src/services/storage.ts`; media service updated for Supabase upload/delete/signed URL/public URL delivery.
- Express app exported as default; Vercel function handler added at `backend/api/index.ts`; backend `vercel.json` added.
- Case-insensitive search mode added to Prisma `contains` filters for Postgres.
- Docs added: `CLOUD_MIGRATION_AUDIT.md`, `ENVIRONMENT_VARIABLES.md`, `SUPABASE_SETUP.md`, `VERCEL_DEPLOYMENT.md`.

## Required before production

- [ ] Provide real `DATABASE_URL` and `DIRECT_URL` (Supabase) in env; inspect Supabase DB read-only for existing data.
- [ ] Apply PostgreSQL baseline/migrations to Supabase only after review/backup.
- [ ] Create Supabase buckets `ocg-public-media`, `ocg-private-media` and set policies.
- [ ] Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` server-side only.
- [ ] Configure Vercel ocg-api and ocg-website projects, env vars, and `/api/v1` rewrite/proxy.
- [ ] Verify PHP runtime actually executes on Vercel; `.htaccess` is not sufficient.
- [ ] Configure SMTP and disable `EXPOSE_PASSWORD_RESET`.
- [ ] Run full backend tests against Postgres test DB.
- [ ] Run auth/CSRF/upload/public-route/admin end-to-end tests on deployed preview.
- [ ] Review in-memory rate limiting; use shared store for multi-instance production.
- [ ] Security review: cookie domain/SameSite/CSRF/CORS for final domain layout.

## Known risks

- MySQL->Postgres data migration not executed; local MariaDB contains bootstrap data only (User=1, Role=5, AuditLog=1) as inspected read-only.
- Supabase DB state unknown (credentials not provided).
- Vercel PHP execution/runtime not verified from this environment.
- Existing dirty worktree contains prior CMS changes; migration commits must be carefully scoped.
