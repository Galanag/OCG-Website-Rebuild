# Test Report

## Test environment

- Date: 2026-11-24.
- PHP: 8.5.4 CLI with the built-in development server.
- Node.js: 22.22.3; npm 10.9.9.
- Database: MariaDB 11.8.8 in an isolated `/tmp/kilo/ocg-mariadb` data directory, port 3307, with separate `ocg_cms` and `ocg_test` databases.
- Prisma: 7.10.1.
- Browser: headless Google Chrome with a local admin preview at `http://127.0.0.1:8080` and API at `http://127.0.0.1:3100`.
- Production Yegara cPanel: **not tested; no deployment was performed**.

## Commands run and actual results

### Prisma and TypeScript

```text
npx prisma generate
✔ Generated Prisma Client (7.10.1)

npx prisma validate
✔ The schema at prisma/schema.prisma is valid

npx tsc -p tsconfig.json --noEmit
✔ passed (no output)

npm run build:all
✔ public CSS, public TypeScript, admin CSS and admin TypeScript builds passed
```

The backend production build was also run with:

```text
npm --prefix backend run build
✔ passed
```

### Database

```text
npx prisma migrate dev --name init
✔ migration 20261123211703_init applied
✔ migration 20261124065821_news_gallery_and_schedule applied

npx prisma migrate deploy
✔ all migrations applied to the isolated test database

npx prisma migrate status
✔ database schema is up to date

npm run seed
✔ roles, settings and existing OCG records seeded without overwriting

npm run bootstrap:admin
✔ first administrator created with mustChangePassword=true
```

### Backend integration/security suite

Command:

```text
NODE_ENV=test \
DATABASE_URL='mysql://ocg:...@127.0.0.1:3307/ocg_test' \
DATABASE_NAME=ocg_test EXPOSE_PASSWORD_RESET=true npm test
```

Final result:

```text
Test Files  1 passed (1)
Tests       12 passed (12)
Duration    ~2.0s
```

The suite covers:

1. Health, public stats and unauthenticated admin access returns 401.
2. Login and `/auth/me` return the expected user and permissions.
3. Invalid credentials return 401.
4. Missing CSRF returns 403; a `VIEWER` receives 403 for a create attempt.
5. Project create, title update with slug preservation, status transition, history, publish, public retrieval and soft delete.
6. Announcement create, `OPEN` state, deadline update and `CLOSED` state.
7. Scheduled announcements remain absent from public listings until their publication time but are visible in the admin listing.
8. News content script sanitization and event publication.
9. Public/private media upload, private download protection and invalid file-type rejection.
10. News gallery attachment and public-only gallery asset exposure.
11. Contact, partnership (including an empty optional URL) and survey persistence.
12. Password reset, old-password rejection, new-password login, stats, audit logs and settings.

### PHP syntax and build

```text
npm run test:php
✔ No syntax errors detected in all 36 public/include/admin PHP files
```

The check covered every top-level PHP page, `includes/*.php`, and `admin/index.php`.

### Public route checks

Using the PHP built-in server and live API:

```text
GET /index.php                                          200
GET /projects.php                                       200
GET /project-detail.php?slug=corridor-development      200
GET /announcements.php                                  200
GET /vacancies.php                                      200
GET /tenders.php                                        200
GET /news.php                                           200
GET /news-detail.php?slug=corridor-development         200
GET /events.php                                         200
GET /event-detail.php?slug=inauguration-of-gololcha-irrigation 200
GET /announcement-detail.php?slug=<temporary-test>    200
GET /article.php?slug=corridor-development              302 to new detail route
GET /contact.php                                        200
GET /partner.php                                        200
GET /survey.php                                         200
```

Rendered output was checked for PHP `Fatal error`, `Warning`, `Notice` and `Deprecated` text; none were found in the tested responses. Public project/news/announcement detail pages displayed live database content, and the public stats endpoint returned published-only counts.

### Form tests

Real PHP form posts were made with CSRF tokens:

- Contact: success flash; row present in `ContactSubmission`.
- Partnership: success flash; row present in `PartnershipSubmission` with an `attachmentId`.
- Survey: success flash; row present in `SurveySubmission`.

The partnership test initially exposed an empty-optional-URL validation bug. It was fixed and the complete form was rerun successfully.

### Admin browser checks

Using headless Chrome:

- `/admin/` rendered the login form.
- API login through the browser origin returned session/CSRF cookies and the expected roles.
- The dashboard rendered 8 statistics cards and 13 chart rows.
- The project list rendered live rows.
- A project created through the rendered admin form appeared in the project list with no form error.
- A final reload with an existing session defaulted to the dashboard, rendered 8 statistics cards and 13 chart rows, and navigated to the project list successfully.
- A temporary news gallery was rendered on the public news detail page with the uploaded media item before cleanup.

## Remaining limitations / not verified

- No deployment to Yegara Premium cPanel was performed. The actual cPanel Node.js version, reverse-proxy capability, TLS, mail and persistent storage must be verified on the host.
- SMTP was not configured; password-reset email delivery was not tested against a real mailbox. The development-only reset-token path was tested.
- The browser check used Chromium only. Firefox/Safari and a full WCAG 2.2 accessibility audit were not run.
- The test suite uses an isolated local MariaDB instance, not the production database.
- The admin is a client-rendered SPA; automated end-to-end coverage is API/HTTP plus the Chromium smoke test above, not a full Playwright/Cypress suite.
- Visual browser testing covered desktop headless Chrome; a full device matrix was not automated.
- No third-party penetration test was performed.

## Conclusion

All implemented code compiles, the Prisma schema validates, migrations and seeds run, the backend integration suite passes 12/12 tests, PHP lint passes, public routes respond with live content, and the admin login/dashboard/project form flow works in headless Chrome. Production deployment remains a separate, explicitly unverified step.