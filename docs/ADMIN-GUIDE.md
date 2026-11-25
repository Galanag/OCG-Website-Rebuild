# Admin Guide

## Access

Open `/admin/` and sign in with the account created by `backend/prisma/bootstrap-admin.ts`. The initial account is a `SUPER_ADMIN` and must change its password at first sign-in. Password changes revoke all active sessions.

If the admin cannot sign in:

1. Confirm the API is running and `/api/v1/health` returns `ok`.
2. Confirm the browser can reach the API origin.
3. In local development, start PHP with `OCG_API_URL=http://127.0.0.1:3100/api/v1` (or the configured API port).
4. Confirm `CORS_ORIGINS` includes the admin origin.
5. Do not disable CSRF or authentication to work around a configuration error.

## Dashboard

The dashboard shows:

- Total, ongoing and completed projects.
- Active vacancies and tender notices.
- Published and draft news.
- Upcoming events.
- Media count and pending contact submissions.
- Project status distribution and announcement mix charts.
- Recent audit activity and quick actions.

## Roles

| Role | Intended access |
|---|---|
| `SUPER_ADMIN` | Full control, users, roles, settings, audit |
| `ADMINISTRATOR` | Content, submissions, publication and audit |
| `EDITOR` | Create/edit content and upload media |
| `PUBLISHER` | Review, publish and unpublish content |
| `VIEWER` | Read-only access |

Permissions are enforced by the API. Hiding a button is not a security boundary. The `VIEWER` role can read content but cannot create or publish it.

## Projects

Use **Projects → New Project** or **Edit**.

Required fields include title, unique reference, short/detailed description, category, construction sector, location and country. Optional fields include client, contractor, consultant, region, coordinates, contract value/currency, funding source, contract type, dates, progress, financial progress, project manager and cover image.

- Leave the slug blank to generate it from the title.
- Changing only the title preserves the existing slug.
- `Published` controls public visibility.
- `Featured` is available for homepage selection.
- Upload gallery files in the project form; they are uploaded through the media API and attached to the project.
- Status changes through the table's status selector or the project form are recorded in `ProjectStatusHistory`.
- Public project URLs are `/projects.php`, `/project-detail.php?slug=...`, and the legacy `/article.php?slug=...` redirect where applicable.

## Announcements

Categories cover vacancies, tenders, procurement notices, expressions of interest, contract awards, general notices, training and other notices.

- Add a reference, publication date, deadline and optional scheduled publication.
- Vacancy fields include position, department, vacancy count, qualifications, experience, employment type and duty station.
- Tender fields include tender reference/title, procurement category, eligibility, scope, submission deadline, bid opening and instructions.
- Upload PDF tender/vacancy documents in the form.
- `OPEN`, `CLOSED` and `UPCOMING` are derived from the schedule/deadline. Expired records remain available historically.
- Public pages: `/announcements.php`, `/vacancies.php`, `/tenders.php`, `/announcement-detail.php?slug=...`.

## News

Create a title, slug, summary, rich content, category, tags, featured/social images and SEO metadata. Save as a draft or publish. The public pages are `/news.php` and `/news-detail.php?slug=...`; the legacy `article.php` route redirects when the slug exists in the CMS.

## Events

Add title, description, category, image, start/end, physical location or online URL, registration URL, organizer and contact information. Published events are separated into upcoming and past events on `/events.php`; details are at `/event-detail.php?slug=...`.

## Media library

Upload images, PDF, Word and Excel documents. The API checks actual file signatures, generates random filenames, applies a size limit and stores metadata in `MediaAsset`. Public images are served through the API; private documents require an authenticated admin session.

- Add meaningful alt text and descriptions.
- Reuse an asset by selecting it in a project/news/event form.
- Deleting an asset that is still referenced is blocked. Remove the content reference first.
- Private documents should be used for sensitive attachments.

## Submissions

The Submissions section supports contact enquiries, partnership proposals and survey feedback. Status can be changed to `NEW`, `IN_PROGRESS`, `RESOLVED` or `ARCHIVED`. Partnership attachments are private and downloaded through the admin media route.

## Users, roles and settings

`SUPER_ADMIN` can create users, assign roles, reset passwords and create custom roles. New users receive a temporary password and must change it. `Site Settings` stores non-secret JSON key/value records such as `site.name`, `site.contactEmail` and `site.social`. Do not put database passwords, API secrets or private credentials in settings.

## Audit and account

The Audit Log records sign-in attempts, password changes, content mutations, publication changes, media actions, user administration and submission updates. The Account page shows the signed-in profile and allows a password change. A password change revokes all sessions, so sign in again.

## Troubleshooting

| Symptom | Check |
|---|---|
| Login fails with CORS error | `CORS_ORIGINS` must include the exact admin origin; API must allow credentials |
| Login succeeds but redirects to sign-in | Session cookie may be blocked; use HTTPS in production and `COOKIE_SECURE=true` |
| Mutation returns `CSRF_INVALID` | Refresh the admin page so a new CSRF cookie/session pair is issued; do not reuse old cookies |
| Upload returns `UNSUPPORTED_MEDIA` | The file's actual bytes are not an allowed image/PDF/Office type |
| Media delete returns `MEDIA_IN_USE` | Remove project/news/event/attachment references first |
| Public page shows legacy content | API unavailable; PHP intentionally uses its last cache or original content fallback |
| Admin shows 401 after browser restart | Normal if the session expired or all sessions were revoked; sign in again |