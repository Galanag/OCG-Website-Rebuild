# Yegara Premium cPanel Deployment

## Important status

The application has been built and tested locally. It has **not** been deployed to Yegara Premium cPanel. The following is the deployment procedure, not a claim that the target plan has already run it.

## 1. Verify hosting capabilities

Before uploading, confirm with the hosting provider that the plan supports:

- Node.js application selector with Node.js 22 or later.
- Persistent application processes (not CGI-only PHP).
- MySQL/MariaDB databases and remote/local database access.
- Apache `.htaccess` and, preferably, reverse proxy to an application URL.
- HTTPS certificate and outbound SMTP if password-reset email is required.
- Sufficient disk for Node dependencies, MySQL data, media and backups.

If the plan cannot run a Node.js application, the API/admin cannot be deployed as designed. Upgrade to a Node-capable cPanel plan or use a separate Node host with the documented API subdomain configuration. Do not simulate success.

## 2. Prepare the local build

On a development machine with the same major Node version as the target:

```bash
npm install
npm --prefix backend install
npm run build:all
cd backend
npx prisma generate
npx prisma validate
npm run build
```

Do not rely on Composer or Docker. The target does not require either.

## 3. Create the MySQL database

In cPanel → MySQL Databases:

1. Create database `ocg_cms` (or the cPanel-prefixed name).
2. Create a dedicated user with a strong password.
3. Add the user to the database with all required privileges for application operation.
4. For initial migration, use a user with permission to create tables. For routine production operation, use a least-privilege application user.

Set these in `backend/.env`:

```dotenv
NODE_ENV=production
PORT=3000
PUBLIC_APP_URL=https://ocg.example
API_PUBLIC_URL=https://ocg.example/api/v1
CORS_ORIGINS=https://ocg.example
COOKIE_SECURE=true
DATABASE_URL=mysql://user:password@127.0.0.1:3306/ocg_cms
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=ocg_cms
DATABASE_CONNECTION_LIMIT=5
SESSION_TTL_HOURS=8
UPLOAD_MAX_BYTES=10485760
```

Replace example domains and credentials. Never commit the real `.env`.

## 4. Deploy the Node application

Recommended layout:

```text
/home/USER/ocg-backend/       # Node application root
/home/USER/ocg-public/        # PHP public_html content
/home/USER/ocg-storage/       # persistent uploads and private storage
```

Upload or clone the repository, then place the backend contents in the Node application root. In cPanel → Setup Node.js App:

- Node.js version: select the verified 22+ version.
- Application mode: Production.
- Application root: `/ocg-backend`.
- Application URL: the domain path/subdomain intended for the API.
- Application startup file: `dist/server.js` after building, or the cPanel startup command documented by the host.
- Run `npm install` / `npm run build` using the cPanel terminal or the application's run command.

Set environment variables in the cPanel application UI or in `backend/.env`, not in public PHP files. Ensure `PORT` matches the cPanel-provided port if the selector does not inject one.

For a same-origin deployment, the Node app must be reachable at `/api/v1` on the public domain. This is preferred because admin and API share a cookie origin. If cPanel can only mount the Node app at a subdomain, see step 7.

## 5. Run migrations and bootstrap

Using the cPanel terminal or Node app shell:

```bash
cd /home/USER/ocg-backend
npx prisma migrate deploy
npx prisma migrate status
npx prisma generate
npm run seed
npm run bootstrap:admin
```

Use a temporary local/development `ADMIN_PASSWORD` only for the bootstrap command, then remove it from shell history and change it at first login. The production app should not expose a default password.

## 6. Deploy PHP and build assets

Copy the public PHP files, `includes/`, `assets/`, `admin/`, `uploads/`, `storage/`, `.htaccess` and `docs/` to the PHP document root. Preserve:

- `backend/.htaccess` in the backend directory if it is web-reachable.
- `uploads/.htaccess` to disable PHP execution.
- `storage/.htaccess` and `storage/partner-uploads/.htaccess` to deny web access.
- `admin/.htaccess` to block TypeScript source.

Set filesystem permissions so the Node process can write:

```text
uploads/images
uploads/documents
uploads/private
storage/cache
storage/media
storage/partner-uploads
```

If `STORAGE_ROOT` is set, point it at the persistent storage parent containing `uploads/` and `storage/`. Do not place private attachments under `public_html`.

For Apache, verify `/api/v1/health` returns JSON. If the Node app is mounted by cPanel, no PHP proxy is required. If the host requires an explicit reverse proxy, configure it in the hosting panel; do not add a PHP script that pretends to be the Node API.

## 7. API subdomain alternative

If same-origin `/api/v1` is impossible:

1. Create `api.ocg.example` and point it to the Node app.
2. Set `API_PUBLIC_URL=https://api.ocg.example/api/v1`.
3. Set `PUBLIC_APP_URL=https://ocg.example`.
4. Set `CORS_ORIGINS=https://ocg.example` (and any admin origin).
5. In cPanel/PHP, set `OCG_API_URL=https://api.ocg.example/api/v1` for public pages.
6. In the admin PHP shell, set the same `OCG_API_URL` so the SPA targets the API subdomain.
7. Keep `COOKIE_SECURE=true`. The API sets host-only cookies for `api.ocg.example`; the browser sends them on same-site requests from the admin origin with `credentials: include`. Do not set `SameSite=None` without HTTPS and a deliberate cross-site design.

If cookies are blocked by a browser/privacy setting, use a same-origin reverse proxy rather than weakening cookie or CSRF protections.

## 8. HTTPS and mail

- Install/redirect to HTTPS for both PHP and API origins.
- Set `COOKIE_SECURE=true` in production.
- Configure SMTP for password-reset email. Without SMTP, reset tokens are logged only in development; production must not expose reset tokens.
- Verify `info@ocg.et` or the configured contact mailbox and `MAIL_FROM`.
- Test contact, partnership and survey submissions on the real host.

## 9. Production smoke checklist

```text
[ ] /api/v1/health returns ok
[ ] /admin/ renders login
[ ] initial administrator can sign in and change password
[ ] project create/edit/status/publish works
[ ] announcement vacancy/tender create/publish works
[ ] news create/publish and event create/publish works
[ ] media upload, public image URL and private download work
[ ] contact, partnership and survey persist
[ ] /projects.php, /announcements.php, /news.php, /events.php work
[ ] /project-detail.php, /announcement-detail.php, /news-detail.php, /event-detail.php work
[ ] existing legacy article URLs redirect or render
[ ] uploads/.htaccess and storage/.htaccess block direct access
[ ] HTTPS and secure cookies are active
[ ] database and uploads are included in backups
```

## Rollback

Keep the previous release and a pre-deployment database/upload backup. To roll back:

1. Stop the Node app.
2. Restore the previous application directory.
3. Restore the database and uploads if a migration was applied.
4. Restart the Node app.
5. Verify `/api/v1/health` and the public/admin smoke checklist.

Do not roll back only the PHP files after a Prisma migration without considering the database schema.