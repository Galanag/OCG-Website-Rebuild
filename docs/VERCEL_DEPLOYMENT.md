# Vercel Deployment

## Recommended topology

Use two Vercel projects from the same GitHub repo, same branch policy:

1. **ocg-website** (root directory: repo root) — PHP public site + admin shell/static assets.
2. **ocg-api** (root directory: `backend`) — Express/Prisma API as Vercel Node functions.

Use a same-origin path proxy from website to API: `/api/v1/*` on website rewrites to ocg-api. This preserves cookie/CSRF simplicity.

## ocg-api (backend)

- **Root Directory**: `backend`
- **Framework Preset**: Other / Node.js
- **Install Command**: `npm install`
- **Build Command**: `npm run build` (or `vercel-build`)
- **Output Directory**: leave default / not used for function-only; `vercel.json` routes all to `api/index.ts`
- **Node.js**: 22.x

Required env vars: see `docs/ENVIRONMENT_VARIABLES.md`. Minimum: `DATABASE_URL`, `DIRECT_URL`, `PUBLIC_APP_URL`, `API_PUBLIC_URL`, `CORS_ORIGINS`, `COOKIE_SECURE=true`, `STORAGE_PROVIDER=supabase`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, bucket vars.

Post-deploy check: `GET https://<ocg-api>.vercel.app/api/v1/health` returns 200.

## ocg-website (root)

- **Root Directory**: repository root
- **Framework Preset**: Other
- **Install Command**: `npm install`
- **Build Command**: `npm run build:all`
- **Output**: PHP site served by Vercel PHP runtime/Dockerfile.vercel as configured. Existing `Dockerfile` is for FrankenPHP/Caddy; Vercel PHP deployment may require `Dockerfile.vercel` or Vercel PHP runtime configuration. Verify in Vercel dashboard.

Update `vercel.json` rewrite destination to the deployed ocg-api URL. For preview environments, use Vercel env-specific rewrites or configure `OCG_API_URL`/proxy accordingly.

## PHP runtime note

The repo currently contains a FrankenPHP Dockerfile/Caddy config. Vercel's PHP support differs from traditional Apache/cPanel; `.htaccess` rules are not relied on. Before production cutover, confirm the selected Vercel runtime actually executes PHP (not static file serving). If PHP runtime is not viable, deploy PHP site on a PHP-capable host and keep API on Vercel with strict CORS/cookie config, or containerize via Vercel Docker support.

## Admin SPA

Admin is built by `npm run build:admin` into `admin/assets/*` and served by `admin/index.php`. Ensure build output is included in deployment and `admin/index.php` sets `window.OCG_API_URL` appropriately (same-origin `/api/v1` preferred).

## Rollback

- Vercel Dashboard → Deployments → Promote previous deployment.
- Do not rollback DB schema destructively. If migration caused issue, use forward-fix migration after backup.
