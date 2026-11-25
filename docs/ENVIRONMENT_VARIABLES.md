# Environment Variables

## Backend (`backend/.env`, Vercel ocg-api project)

| Variable | Required | Local | Preview | Production | Description |
|---|---:|---|---|---|---|
| `NODE_ENV` | yes | `development` | `preview`/`production` as appropriate | `production` | Runtime mode. |
| `PORT` | local | `3100` | n/a | n/a | Local API port only. |
| `PUBLIC_APP_URL` | yes | `http://127.0.0.1:8000` | Vercel website URL | `https://www.example.org` | Public website origin. |
| `API_PUBLIC_URL` | yes | `http://127.0.0.1:3100/api/v1` | `https://<api>.vercel.app/api/v1` or proxied URL | `https://www.example.org/api/v1` or API domain | Public API base URL. |
| `CORS_ORIGINS` | yes | local origins | preview/prod website origins | production website origins | Comma-separated allowed origins. |
| `COOKIE_SECURE` | yes | `false` | `true` | `true` | Secure cookies; forced true in production. |
| `LOG_LEVEL` | no | `info` | `info` | `info` | `debug|info|warn|error`. |
| `DATABASE_URL` | yes | local Postgres or Supabase pooled connection | Supabase pooled connection | Supabase pooled connection | Prisma runtime connection. Use Supabase pooler/transaction mode appropriate for serverless. |
| `DIRECT_URL` | yes | direct Postgres connection | Supabase direct/session connection | Supabase direct/session connection | Prisma migrate/schema operations; do not use transaction pooler. |
| `DATABASE_CONNECTION_LIMIT` | no | `5` | `1-5` | `1-5` | Pool size per serverless instance; keep low. |
| `SESSION_TTL_HOURS` | no | `8` | `8` | `8` | Session lifetime. |
| `PASSWORD_RESET_TTL_MINUTES` | no | `30` | `30` | `30` | Reset token lifetime. |
| `UPLOAD_MAX_BYTES` | no | `10485760` | as needed | as needed | Max upload size. |
| `STORAGE_PROVIDER` | yes | `local` | `supabase` | `supabase` | `local` or `supabase`. |
| `STORAGE_LOCAL_ROOT` | local | repo root | n/a | n/a | Local storage root for dev. |
| `SUPABASE_URL` | when supabase storage | optional | required | required | `https://<ref>.supabase.co`. |
| `SUPABASE_SECRET_KEY` | when supabase storage | optional | required server-side only | required server-side only | Supabase service-role/secret key. **Never frontend.** |
| `SUPABASE_PUBLIC_MEDIA_BUCKET` | no | `ocg-public-media` | `ocg-public-media` | `ocg-public-media` | Public bucket. |
| `SUPABASE_PRIVATE_MEDIA_BUCKET` | no | `ocg-private-media` | `ocg-private-media` | `ocg-private-media` | Private bucket. |
| `SUPABASE_SIGNED_URL_TTL_SECONDS` | no | `3600` | `3600` | `3600` | Signed URL TTL for private files. |
| `ADMIN_NAME` | bootstrap only | optional | optional | optional/manual | Initial admin bootstrap; do not keep default in prod. |
| `ADMIN_EMAIL` | bootstrap only | optional | optional | optional/manual | Initial admin bootstrap. |
| `ADMIN_PASSWORD` | bootstrap only | optional | optional | optional/manual | Initial admin bootstrap; use strong secret, rotate/change on first login. |
| `SMTP_HOST` | for email | empty | set | set | SMTP host. |
| `SMTP_PORT` | for email | `587` | `587` | `587` | SMTP port. |
| `SMTP_SECURE` | for email | `false` | as required | as required | TLS mode. |
| `SMTP_USER` | for email | empty | secret | secret | SMTP user. |
| `SMTP_PASSWORD` | for email | empty | secret | secret | SMTP password. |
| `SMTP_FROM` | for email | configured | configured | configured | From address. |
| `EXPOSE_PASSWORD_RESET` | no | `true` dev only | `false` | `false` | Never enable in production. |

## PHP website (`ocg-website` Vercel project / local PHP)

| Variable | Required | Description |
|---|---:|---|
| `OCG_API_URL` | recommended | Absolute API base, e.g. `https://www.example.org/api/v1`. If omitted, PHP uses same-origin `/api/v1`. |
| `OCG_SITE_URL` | recommended | Canonical site URL. |
| `OCG_PUBLIC_URL` | optional | Alternate public URL fallback. |
| `OCG_CONTACT_EMAIL` | optional | Public contact email override. |
| `OCG_MAIL_FROM` | optional | PHP mail fallback from address. |

## Security rules

- Never commit `.env` files or real credentials.
- Never expose `SUPABASE_SECRET_KEY`, `DIRECT_URL`, `DATABASE_URL`, SMTP passwords, or admin bootstrap passwords to browser code.
- Use Vercel environment variables for Preview/Production.
- Rotate any credential accidentally exposed in chat, logs, or commits.
