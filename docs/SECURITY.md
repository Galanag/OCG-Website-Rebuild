# Security

## Implemented controls

### Authentication

- Argon2id password hashing with a configured memory/time cost.
- Opaque 256-bit session tokens; only SHA-256 hashes are stored in `Session`.
- Database-backed sessions with expiry, revocation and user/status checks on every request.
- HttpOnly session cookie; secure cookie in production; SameSite=Lax.
- CSRF token stored hashed in the session and required in `X-CSRF-Token` for admin mutations.
- Login and password-reset rate limits.
- Password reset tokens are random, hashed at rest, single-use and expiring.
- Password changes revoke all sessions.
- Initial administrator is created from environment variables with `mustChangePassword=true`; no default production password is shipped.

### Authorization

Permissions are stored per role and checked by middleware on every protected route. Standard roles:

- `SUPER_ADMIN`: users, roles, settings, audit and content.
- `ADMINISTRATOR`: content, publication, submissions and audit.
- `EDITOR`: content editing and media.
- `PUBLISHER`: publication workflow.
- `VIEWER`: read-only.

Public routes never serve unpublished content. Admin routes cannot be reached with only a public session or by adding query parameters.

### Input and output

- Zod validation for login, content, settings, users, submissions and query identifiers.
- Express JSON body limits.
- Rich text sanitized with an allowlist of tags/attributes and HTTP(S)/mailto schemes.
- Public output is escaped by PHP and the admin UI; API JSON is consumed as data, not HTML except sanitized rich-text fields.
- Prisma parameterizes database queries; no string-built SQL is used.

### Uploads

- Multer memory storage with a configurable maximum size.
- Actual file signature validation with `file-type`; extension and declared MIME are not trusted.
- Random UUID filenames and `wx` write mode to avoid overwrite attacks.
- Metadata stored in `MediaAsset`; no blobs in MySQL.
- Public/private visibility enforced by the API.
- Apache rules disable PHP/CGI execution in `uploads/` and deny web access to `storage/`.

### Audit and monitoring

`AuditLog` records authentication, content, publication, media, user, settings and submission actions with actor, email, IP, user agent, entity and metadata. The API logs errors to the Node process log. Production should ship logs to the host's log collector and monitor 5xx responses, login failures and rate-limit events.

### Transport and browser hardening

- Helmet security headers.
- CORS allowlist with credentials.
- `X-Content-Type-Options: nosniff` on media responses.
- `X-Robots-Tag: noindex,nofollow` on the admin shell.
- HTTPS is required in production; `COOKIE_SECURE=true`.
- Admin source TypeScript is blocked from static serving.

## Residual risks and operational requirements

- The local development server uses HTTP; production must use HTTPS.
- Rate limiting is in-process; use a shared store if running multiple Node workers.
- SMTP is not configured by the repository. Outbound email and password-reset delivery must be configured and tested on Yegara.
- The first administrator password must be supplied through a secure channel and changed immediately.
- Media and database backups must be encrypted and access-controlled.
- A compromised administrator session is still a risk; enforce strong unique passwords, short session TTLs and prompt revocation.
- The public PHP fallback uses legacy static content when the API is unavailable; it does not bypass authentication or expose drafts.
- A full third-party penetration test and a WCAG 2.2 audit are recommended before launch.

## Secret handling

Never commit `backend/.env`, `.env.local`, database dumps, private uploads or SMTP credentials. Use cPanel environment variables or a protected `.env` outside the public document root. Restrict `.env` permissions to the application user. Rotate credentials after any suspected exposure.

## Security test coverage

The backend test suite verifies invalid credentials, unauthenticated admin access, CSRF rejection, role denial, public draft hiding, rich-text script removal, private media protection and password-reset behavior. See `TEST-REPORT.md` for actual results and limitations.