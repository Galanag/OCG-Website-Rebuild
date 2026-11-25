# Database

## Engine and Prisma setup

- Engine: MySQL 8 / MariaDB 10.11+; the local verification used MariaDB 11.8.
- ORM: Prisma 7.10.1 (stable 7.x, not a Prisma 8 release candidate).
- Schema: `backend/prisma/schema.prisma`.
- Client output: `backend/src/generated/prisma` via the `prisma-client` generator.
- Adapter: `@prisma/adapter-mariadb`.
- Migration directory: `backend/prisma/migrations`.
- Seed: `backend/prisma/seed.ts`.
- Bootstrap: `backend/prisma/bootstrap-admin.ts`.

All model identifiers are UUID strings stored as `VARCHAR(36)`. JSON is used only for role permissions, tags and audit metadata/settings. Uploaded file contents are stored on disk; the database stores path, name, MIME type, size, visibility and ownership metadata.

## Required models

| Model | Purpose |
|---|---|
| `User` | Administrator/editor accounts and password hashes |
| `Role` | Named permission sets |
| `UserRole` | Many-to-many user/role assignment |
| `Session` | Hashed opaque login sessions, CSRF hash and expiry |
| `PasswordResetToken` | Hashed, expiring password-reset tokens |
| `Project` | Project register and publication state |
| `ProjectImage` | Project gallery entries and ordering |
| `ProjectStatusHistory` | Immutable status-transition history |
| `Announcement` | Vacancies, tenders, procurement and general notices |
| `AnnouncementAttachment` | Tender/vacancy documents |
| `NewsArticle` | News content, tags and SEO fields |
| `NewsImage` | News article gallery entries and ordering |
| `Event` | Event dates, location, online and registration links |
| `MediaAsset` | Validated image/document metadata |
| `ContactSubmission` | Contact-form submissions |
| `PartnershipSubmission` | Partnership enquiries and private attachments |
| `SurveySubmission` | Public feedback submissions |
| `AuditLog` | Administrative and authentication audit trail |
| `SiteSetting` | JSON site configuration |

## Key relationships

- `User` → `UserRole` → `Role`.
- `User` → `Session`, `PasswordResetToken`, `AuditLog`.
- `Project` → `ProjectImage` → `MediaAsset`.
- `Project` → `ProjectStatusHistory` → `User` (optional actor).
- `Announcement` → `AnnouncementAttachment` → `MediaAsset`.
- `NewsArticle` → `NewsImage` → `MediaAsset` for article galleries.
- `NewsArticle` and `Event` reference `MediaAsset` for featured/social/event images.
- `PartnershipSubmission` optionally references a private `MediaAsset`.
- `User` is an optional creator/updater for content so historical records survive account deletion.

## Publication, status and soft deletion

Content models include `published`, `publishedAt`, `createdAt`, `updatedAt`, `createdById`, `updatedById` and `deletedAt` where appropriate. Public queries require:

```prisma
published = true
deletedAt = null
```

Project statuses are:

`PROPOSED`, `PLANNING`, `TENDERING`, `AWARDED`, `STARTED`, `ONGOING`, `ON_HOLD`, `COMPLETED`, `CANCELLED`.

Announcement categories are:

`JOB_VACANCY`, `BID_TENDER`, `PROCUREMENT_NOTICE`, `EXPRESSION_OF_INTEREST`, `CONTRACT_AWARD`, `GENERAL_NOTICE`, `TRAINING`, `OTHER`.

Event statuses are `UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`.

Submission statuses are `NEW`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED`.

## Indexes

The schema includes indexes for public listing and filtering, for example:

- Project: `(published, deletedAt, featured)`, `(status, published, deletedAt)`, `(createdAt, published)`, cover image, creator/updater.
- Announcement: `(published, category, deadline, deletedAt)`, `(published, featured, deletedAt)`, deadline and category.
- News: `(published, publishedAt, deletedAt)`, category, featured image.
- Event: `(published, startsAt, deletedAt)`, `(status, published, startsAt)`.
- Media: kind/visibility/deleted, creation date.
- Submissions: status/creation and email/creation.
- Audit: creation, user/creation, entity and action.

## Migrations

Development/local with permission to create a shadow database:

```bash
cd backend
npx prisma migrate dev --name <change-name>
```

Production/CI:

```bash
cd backend
npx prisma migrate deploy
npx prisma migrate status
npx prisma generate
```

The initial migration was generated as `20261123211703_init` and applied successfully to both the isolated development and test databases.

## Seed and first administrator

The seed:

- Upserts the five standard roles: `SUPER_ADMIN`, `ADMINISTRATOR`, `EDITOR`, `PUBLISHER`, `VIEWER`.
- Imports the existing four project records, four news records and two event records when their slugs do not already exist.
- Creates default site settings only when absent.
- Does not overwrite existing content or an existing administrator password.

Run:

```bash
cd backend
npm run seed
npm run bootstrap:admin
```

`bootstrap:admin` reads `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`. It refuses to run without a 12+ character password, creates the account only if absent, assigns `SUPER_ADMIN`, and sets `mustChangePassword=true`.

## Backup and restore

Backup both the database and persistent upload directory. Example local/production commands:

```bash
mkdir -p backup/$(date +%Y%m%d)
mysqldump --single-transaction --routines --triggers \
  -h "$DATABASE_HOST" -P "$DATABASE_PORT" -u "$DATABASE_USER" -p \
  "$DATABASE_NAME" > "backup/$(date +%Y%m%d)/ocg-db.sql"

tar -C /path/to/ocg/storage-root -czf \
  "backup/$(date +%Y%m%d)/ocg-uploads.tar.gz" uploads storage
```

Restore:

```bash
mysql -h "$DATABASE_HOST" -P "$DATABASE_PORT" -u "$DATABASE_USER" -p "$DATABASE_NAME" \
  < backup/YYYYMMDD/ocg-db.sql

mkdir -p /path/to/ocg/storage-root
tar -C /path/to/ocg/storage-root -xzf backup/YYYYMMDD/ocg-uploads.tar.gz
```

After restoring to a new host:

```bash
cd backend
npx prisma migrate status
npx prisma generate
npm run build
npm start
```

Do not store database dumps, `.env` files or private uploads under a public web directory. cPanel backups should include the database, the Node application, `uploads/`, `storage/` and the PHP public files.

## Retention and deletion

Project, announcement, news and event deletion is soft deletion by default. Media deletion is refused with `MEDIA_IN_USE` when referenced by a project, gallery, news image, event image, announcement attachment or partnership submission. Remove those references before deleting the media record. Retain audit logs and submission records according to OCG's records-retention policy.