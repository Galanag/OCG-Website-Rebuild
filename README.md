# Oro-Construction Group (OCG) Website & CMS

This repository contains the OCG public website and a database-backed administration system. The existing PHP pages remain the public frontend; a separate TypeScript/Express API provides content, authentication, media handling and submissions. Prisma 7 with MySQL/MariaDB is the system of record.

## Implemented

- Existing PHP public website preserved, with shared navigation and legacy content retained as fallback.
- Public project register and project detail pages.
- Public announcements, vacancies, tender notices and announcement detail pages.
- Public news listing/detail and events listing/detail.
- Homepage API integration for featured/latest projects, published-only portfolio statistics, announcements, news and upcoming events.
- Contact, partnership and survey forms persist to MySQL through the API, with the original mail path as fallback.
- Secure admin SPA at `/admin/` with responsive navigation, dashboard statistics/charts, projects, announcements, news, events, media library, submissions, users, roles, audit logs, settings and account password management.
- Argon2id password hashing, hashed opaque sessions, CSRF protection, role permissions, rate limiting, Zod validation, rich-text sanitization and audit logging.
- Prisma schema, initial migration, idempotent seed and first-administrator bootstrap.
- Production build scripts for public Tailwind/TypeScript and admin Tailwind/TypeScript.

## Technology stack

| Layer | Technology |
|---|---|
| Public website | PHP 8.2+ (tested with PHP 8.5), HTML5, Tailwind CSS, TypeScript |
| API | Node.js 22+, TypeScript, Express 5, Zod, Prisma 7.10.1 |
| Database | MySQL 8 / MariaDB 10.11+ (tested with MariaDB 11.8) |
| Admin | PHP-served TypeScript SPA, Tailwind CSS |
| Authentication | Argon2id, opaque session tokens, CSRF tokens |
| File storage | Local persistent `uploads/` with API-authorized downloads |

## Repository structure

```text
.
├── admin/                 # Admin PHP shell, TypeScript source, compiled assets
├── assets/                # Public compiled CSS/JS and legacy media references
├── backend/               # TypeScript API, Prisma schema/migrations/seed
├── docs/                  # Architecture, database, deployment, security, API, tests
├── includes/              # PHP config, API client, components and data fallbacks
├── uploads/               # Public/private API-managed media (contents ignored)
├── storage/               # Cache, private partner fallback files (not web accessible)
├── *.php                  # Public PHP pages and detail routes
└── package.json           # Public/admin build and test scripts
```

## Requirements

- Node.js 22 or later and npm 10+.
- PHP 8.2+ with `pdo_mysql`, `fileinfo`, `mbstring` and `openssl` recommended.
- MySQL 8 or MariaDB 10.11+.
- Apache/cPanel with `.htaccess`, or another PHP-capable web server.
- No Docker is required.

## Local development

### 1. Install dependencies

```bash
npm install
npm --prefix backend install
```

### 2. Create the database

Create a MySQL/MariaDB database and user with permission to create tables and a shadow database for Prisma migrations. Example:

```sql
CREATE DATABASE ocg_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ocg'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT ALL PRIVILEGES ON ocg_cms.* TO 'ocg'@'127.0.0.1';
```

For `prisma migrate dev`, the database user also needs permission to create the shadow database, or use an administrative user for local migration development. Production deployments should use `prisma migrate deploy` with a least-privilege application user.

### 3. Configure the API

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`. Set `DATABASE_URL` and the discrete `DATABASE_*` variables, `CORS_ORIGINS`, `PUBLIC_APP_URL`, and a strong `ADMIN_PASSWORD`. Never commit the real `.env`.

### 4. Run migrations, seed and bootstrap

```bash
cd backend
npx prisma generate
npx prisma migrate deploy   # use migrate dev only in disposable development
npm run seed
npm run bootstrap:admin
```

The seed is idempotent: it creates the five standard roles and migrates the existing public project/news/event records without overwriting an existing record with the same slug. The bootstrap creates `ADMIN_EMAIL` as `SUPER_ADMIN` with `mustChangePassword=true`; it never changes an existing user's password.

### 5. Start the API and PHP site

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2, from the repository root:

```bash
OCG_API_URL=http://127.0.0.1:3100/api/v1 php -S 127.0.0.1:8080
```

Open `http://127.0.0.1:8080/` and `http://127.0.0.1:8080/admin/`.

For production, leave `OCG_API_URL` unset so both PHP and admin use the same origin `/api/v1`.

## Build

```bash
npm run build:all
```

Individual builds:

```bash
npm run build
npm run build:admin
npm --prefix backend run build
```

## Tests

Backend integration/security tests, using a disposable test database:

```bash
cd backend
NODE_ENV=test \
DATABASE_URL='mysql://ocg:password@127.0.0.1:3306/ocg_test' \
DATABASE_HOST=127.0.0.1 DATABASE_PORT=3306 \
DATABASE_USER=ocg DATABASE_PASSWORD=password DATABASE_NAME=ocg_test \
EXPOSE_PASSWORD_RESET=true npm test
```

PHP syntax checks:

```bash
npm run test:php
```

Prisma and TypeScript checks:

```bash
cd backend
npx prisma validate
npx tsc -p tsconfig.json --noEmit
```

The actual local test run and its limitations are recorded in [docs/TEST-REPORT.md](docs/TEST-REPORT.md).

## API and admin

- API routes are under `/api/v1`.
- Public content routes only return published, non-deleted records.
- Admin routes are under `/api/v1/admin` and require a session cookie, CSRF token for mutations, and the relevant permission.
- Admin UI: `/admin/`.
- First administrator: use `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then change the password at first sign-in.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [Admin guide](docs/ADMIN-GUIDE.md)
- [Yegara cPanel deployment](docs/DEPLOYMENT-YEGARA.md)
- [Security](docs/SECURITY.md)
- [API reference](docs/API.md)
- [Test report](docs/TEST-REPORT.md)

## Yegara deployment status

This implementation has been built and tested locally against PHP 8.5, Node 22 and MariaDB 11.8. It has **not** been deployed to the Yegara Premium cPanel account. The target hosting must support a Node.js application and persistent MySQL storage. Follow [docs/DEPLOYMENT-YEGARA.md](docs/DEPLOYMENT-YEGARA.md) and verify the actual cPanel Node selector version before launch. Do not treat a local successful build as a production deployment.

## Legacy content and links

Existing public pages, project/news/event records and the legacy article route are retained. `article.php?slug=...` redirects to the new detail route when the slug exists in the CMS; otherwise the original public project update remains available. Existing contact, partnership and survey URLs are unchanged.