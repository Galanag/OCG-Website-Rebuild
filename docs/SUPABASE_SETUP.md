# Supabase Setup

## Project

- Project ref: `rnjcwjcbqhvykbidnqef`
- Project URL: `https://rnjcwjcbqhvykbidnqef.supabase.co`
- Dashboard: `https://supabase.com/dashboard/project/rnjcwjcbqhvykbidnqef`

## 1. Database connections (manual, secret-safe)

In Supabase Dashboard → Project Settings → Database, copy connection strings into environment variables only:

- `DATABASE_URL`: pooled/runtime connection for Prisma Client in Vercel/serverless. Prefer transaction pooler for serverless; keep pool size low (`DATABASE_CONNECTION_LIMIT=1` or `2`).
- `DIRECT_URL`: direct/session connection for Prisma migrations and schema commands. Do not use transaction pooler for migrations.

Do not paste credentials into source, docs, tickets, or chat. Store in local `backend/.env` (ignored) and Vercel project env vars.

## 2. Inspect before migrating

Before applying migrations, inspect the target DB read-only:

```bash
# Example read-only checks (requires credentials in env, do not echo them)
cd backend
npx prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;
SQL
```

If tables/data exist, stop and create a reviewed data-migration plan. Do not run `prisma migrate reset`, do not drop schemas/tables, and do not overwrite data.

## 3. Prisma migration commands

```bash
cd backend
npm install
npx prisma validate
npx prisma generate
# For development against a disposable/local Postgres only:
# npx prisma migrate dev
# For Supabase/prod-like environments:
npx prisma migrate deploy
npx prisma migrate status
```

Use `DIRECT_URL` for migrations. Ensure `prisma.config.ts` reads `DATABASE_URL` and `DIRECT_URL` from env.

## 4. Storage buckets

Create buckets in Supabase Dashboard → Storage:

- `ocg-public-media` — public bucket for public images/documents intended for public delivery.
- `ocg-private-media` — private bucket for partnership/admin private documents.

Recommended policies:
- Public bucket: read allowed through public URLs only for intended objects; writes only via server-side service role.
- Private bucket: no anonymous read; writes/reads only via server-side service role; app issues signed URLs after authorization.

## 5. Storage env vars

Set server-side only in backend/Vercel API project:

- `SUPABASE_URL=https://rnjcwjcbqhvykbidnqef.supabase.co`
- `SUPABASE_SECRET_KEY=<service-role-or-secret-key>`
- `SUPABASE_PUBLIC_MEDIA_BUCKET=ocg-public-media`
- `SUPABASE_PRIVATE_MEDIA_BUCKET=ocg-private-media`
- `SUPABASE_SIGNED_URL_TTL_SECONDS=3600`

Never expose `SUPABASE_SECRET_KEY` in PHP/JS frontend or public env vars.

## 6. Admin bootstrap

After DB migration:

```bash
cd backend
ADMIN_NAME="OCG Administrator" ADMIN_EMAIL="admin@example.org" ADMIN_PASSWORD="<strong-random-password>" npm run bootstrap:admin
```

Use a secure one-time password and force change on first login (already supported by app). Do not keep bootstrap password in production env after use.

## 7. Rollback

- Prisma migrations are forward-only in production; prefer additive migrations.
- Before applying production migrations, take Supabase backup/snapshot.
- If a deployment fails, rollback Vercel deployment to previous build; do not run destructive DB rollback SQL unless reviewed and backed up.
