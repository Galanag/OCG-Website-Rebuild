# Local validation report

Validated in the work environment on 26 October 2026.

- All PHP files pass `php -l` syntax checks.
- Browser JavaScript passes `node --check` after compiling the TypeScript source with `tsc -p tsconfig.json`.
- `package.json`, `tsconfig.json` and `sitemap.xml` parse successfully.
- Local GET requests return HTTP 200 for the home page, organization pages, services/projects, gallery pages, news, project articles, contact, partner, survey and privacy notice. `404.php` intentionally returns 404.
- The contact, partner and survey forms were submitted locally. CSRF tokens, server-side validation and redirect/flash responses work. The local PHP runtime cannot deliver mail, so the forms display a configuration message; outgoing email must be tested and configured on cPanel.

## Not verified in this environment

- Live cPanel hosting, DNS, SSL, the host's outgoing mail service and final upload permissions.
- Full image migration. Public source images remain linked from OCG's existing media library; download the approved images locally before replacing/removing the old media library.
- Approval of current statistics, leadership, content, image rights and the draft privacy notice.
