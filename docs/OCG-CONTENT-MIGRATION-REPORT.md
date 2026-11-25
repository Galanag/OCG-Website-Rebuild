# OCG Corporate Content Migration Report

## Implemented

- Added a CMS-managed `PageSection` model, migration SQL and public/admin API.
- Added create-only corporate content seeding for the official profile.
- Added an admin **Company Content** module for page/section title, content, metadata JSON, image, order, publication and soft deletion.
- Updated the homepage with the official tagline, OSF identity, five subsidiaries, reported backlog, workforce and FY 2026/2027 target labels.
- Rebuilt About as a comprehensive CMS-backed profile with vision, mission, ten values, board, executives, historical CEO message and strategy.
- Added comprehensive subsidiary profiles with 2018 historical results and FY 2026/2027 targets.
- Added `financial-performance.php` with labelled historical revenue/assets and target charts.
- Updated services with official service lines, capacity, equipment, properties, quality, clients, CSR and why-choose content.
- Updated contact details to the official profile while preserving the deployed domain/hosting.
- Redesigned the admin login as a centered, responsive, modern card. Authentication, CSRF, cookies, sessions and RBAC were not changed.

## Migration status

- Schema migration SQL: `backend/prisma/migrations/20261125090000_cms_corporate_content/migration.sql`.
- Prisma client generation: passed.
- Backend TypeScript: passed.
- Admin TypeScript/CSS build: passed.
- PHP lint: passed.
- Database migration/seed and backend integration tests: **not run** because the isolated MariaDB data directory was removed by environment cleanup and the host 3306 service is inaccessible with available credentials. The database was not reset or recreated.

## Recovery before production

1. Start or restore the approved MariaDB instance containing the existing OCG data.
2. Configure `backend/.env` with the correct database host/port/name and credentials.
3. Run `npx prisma migrate deploy`.
4. Run `npm run seed` (create-only; existing content is preserved).
5. Run `npm run build:all` and `npm --prefix backend run build`.
6. Start the API and PHP services and verify `/api/v1/health`, `/admin/`, the public pages and Company Content editor.
7. Do not run `bootstrap:admin` if the existing administrator is present.

## Approval

The source audit and approval register identify the reporting-period, chronology, leadership-date, certification and contact differences. No fictional content or unapproved resolution was introduced.