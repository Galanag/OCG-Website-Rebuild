# API Reference

Base URL: `/api/v1` by default. In local development, set `API_PUBLIC_URL` or `OCG_API_URL` to the Node server, for example `http://127.0.0.1:3100/api/v1`.

## Conventions

- JSON request and response bodies unless noted.
- Successful responses use `{ "data": ..., "message": ... }`.
- Errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted data is invalid.",
    "details": [{ "path": "title", "message": "Required" }]
  }
}
```

- Common codes: `INVALID_CREDENTIALS`, `UNAUTHENTICATED`, `FORBIDDEN`, `CSRF_INVALID`, `VALIDATION_ERROR`, `DUPLICATE_VALUE`, `NOT_FOUND`, `MEDIA_IN_USE`, `UNSUPPORTED_MEDIA`, `RATE_LIMITED`.
- Public content routes return only published, non-deleted records.
- Content with a future `scheduledFor` remains admin-only until that time, even when `published` is true.
- Admin mutations require the session cookie and `X-CSRF-Token` matching the CSRF cookie.

## Health and public statistics

```text
GET /health
GET /stats
```

`GET /stats` returns published-only aggregate project/announcement/news/event counts for the homepage.

## Authentication

```text
POST /auth/login
POST /auth/logout
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/change-password
```

`POST /auth/login`:

```json
{ "email": "admin@example.org", "password": "a-long-unique-password" }
```

Returns user, roles and `csrfToken`; sets `ocg_session` (HttpOnly) and `ocg_csrf` cookies.

`POST /auth/forgot-password` accepts `{ "email": "..." }`. In non-production development with `EXPOSE_PASSWORD_RESET=true`, it may return a reset token for testing; production must use SMTP and must not expose tokens.

`POST /auth/reset-password` accepts `{ "token": "...", "password": "..." }`.

`POST /auth/change-password` accepts `{ "currentPassword": "...", "newPassword": "..." }`.

## Public content

```text
GET /projects
GET /projects/:slug
GET /announcements
GET /announcements/:slug
GET /news
GET /news/:slug
GET /events
GET /events/:slug
GET /media
GET /media/:id
GET /media/:id/file
POST /contact
POST /partnership
POST /survey
```

Common list query parameters:

- `page`, `limit` (1–100), `q`, `sort` (`-createdAt` style).
- Projects: `status`, `category`, `featured=true`.
- Announcements: `category`, `kind=vacancy|tender`, `state=OPEN|CLOSED|UPCOMING`.
- News: `category`, `tag`.
- Events: `status`, `timeframe=upcoming|past`.
- Media: `kind=IMAGE|DOCUMENT`.

Public list responses have `data.items` and `data.meta` with `page`, `limit`, `total`, `pages`.

`POST /partnership` is multipart when an attachment is supplied. Fields: `firstName`, `lastName`, `organization`, `email`, `phone`, `country`, `partnerType`, `organizationWebsite`, `notes`, `consent`, optional `attachment`. `consent` may be `1`, `true`, `on` or a JSON boolean.

## Admin content

Admin project routes:

```text
GET    /admin/projects
POST   /admin/projects
GET    /admin/projects/:id
PUT    /admin/projects/:id
PATCH  /admin/projects/:id
POST   /admin/projects/:id/status
POST   /admin/projects/:id/publish
PUT    /admin/projects/:id/gallery
DELETE /admin/projects/:id/gallery/:imageId
DELETE /admin/projects/:id
```

Permissions: read `content:read`; create/update `content:write`; status update `content:write`; publish `content:publish`; delete `content:delete`.

Project status body:

```json
{ "status": "ONGOING", "note": "Optional note" }
```

Publish body:

```json
{ "published": true }
```

Gallery body:

```json
{ "mediaIds": ["uuid-1", "uuid-2"] }
```

Announcement routes:

```text
GET    /admin/announcements
POST   /admin/announcements
GET    /admin/announcements/:id
PUT    /admin/announcements/:id
POST   /admin/announcements/:id/publish
PUT    /admin/announcements/:id/attachments
DELETE /admin/announcements/:id
```

News routes:

```text
GET    /admin/news
POST   /admin/news
GET    /admin/news/:id
PUT    /admin/news/:id
PUT    /admin/news/:id/gallery
POST   /admin/news/:id/publish
DELETE /admin/news/:id
```

Event routes:

```text
GET    /admin/events
POST   /admin/events
GET    /admin/events/:id
PUT    /admin/events/:id
POST   /admin/events/:id/publish
DELETE /admin/events/:id
```

All admin content routes require the corresponding `content:*` permission. Public/admin separation is enforced in the router, not merely by filtering the response.

## Media

```text
GET    /admin/media
POST   /admin/media          # multipart: file, visibility, altText, description
GET    /admin/media/:id
PUT    /admin/media/:id
GET    /admin/media/:id/file
DELETE /admin/media/:id
```

`visibility` is `PUBLIC` or `PRIVATE`. `POST /admin/media` requires `media:write` for the upload. Public file downloads are available only for public assets; private downloads require an authenticated admin session.

## Submissions

```text
GET   /admin/submissions/:resource
GET   /admin/submissions/:resource/:id
PATCH /admin/submissions/:resource/:id/status
```

`:resource` is `contact`, `partnership` or `survey`. Status body: `{ "status": "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED" }`. Requires `submissions:read`.

## Administration

```text
GET  /admin/stats
GET  /admin/users
POST /admin/users
GET  /admin/users/:id
PUT  /admin/users/:id
DELETE /admin/users/:id
POST /admin/users/:id/reset-password
GET  /admin/roles
POST /admin/roles
GET  /admin/settings
PUT  /admin/settings
GET  /admin/audit-logs
```

User create body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.org",
  "password": "a-long-temporary-password",
  "roleIds": ["role-uuid"]
}
```

Role create body:

```json
{
  "name": "CUSTOM_EDITOR",
  "description": "Custom editorial access",
  "permissions": ["content:read", "content:write"]
}
```

Settings body:

```json
{ "key": "site.name", "value": { "text": "Oro-Construction Group" } }
```

`GET /admin/stats` requires `content:read`; users requires `users:manage`; roles requires `roles:manage`; settings requires `settings:manage`; audit logs requires `audit:read`.

## Validation and errors

All write bodies are validated with Zod before services run. Dates use ISO 8601. IDs and slugs are validated at the route boundary. Public error responses do not include stack traces or database credentials. Prisma unique violations are returned as `DUPLICATE_VALUE`; missing records as `NOT_FOUND`; validation failures as `VALIDATION_ERROR` with field paths.

## Example admin mutation

```bash
# after login, using the returned CSRF token and cookie jar
curl -sS -b cookies.txt \
  -H "X-CSRF-Token: $CSRF" \
  -H 'Content-Type: application/json' \
  -d '{"title":"New OCG Project","reference":"OCG-2027-001","shortDescription":"Short summary","description":"<p>Details</p>","category":"Buildings","constructionSector":"Building construction","location":"Addis Ababa","country":"Ethiopia","published":false}' \
  https://ocg.example/api/v1/admin/projects
```

For public pages, set `OCG_API_URL` in the PHP environment. For the admin SPA, leave `OCG_API_URL` empty for same-origin `/api/v1`, or set it to the API subdomain during development.