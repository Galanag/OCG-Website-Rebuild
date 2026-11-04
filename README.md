# OCG Public Website Rebuild

A PHP-based, responsive public website for Oro-Construction Group (OCG), prepared for local testing in VS Code and upload to cPanel/shared hosting. The package does not require a database or a PHP framework.

## What is included

- Home page with OCG overview, reported headline metrics, service areas, selected project updates, subsidiaries and FAQs.
- About OCG and leadership, Vision & Mission, Subsidiaries, Services & Projects and Why Choose OCG pages.
- Photo Gallery, Videos, Events, Documents, News & Updates and individual project article pages.
- Contact, Partner with OCG (including validated optional document upload), and Feedback Survey forms; a draft privacy notice is also included for OCG review.
- Shared PHP header/footer, navigation with responsive mobile menu, CSRF tokens, basic anti-spam honeypot fields, and server-side validation.
- Local stylesheet fallback, Tailwind CSS source/configuration and TypeScript source with browser-ready JS included.
- `.htaccess` rules to disable directory listing and block direct web access to PHP includes, source files and uploaded partnership documents.

## Prerequisites

- PHP 8.1+ (PHP 8.2+ recommended) with sessions enabled.
- Apache hosting with `.htaccess` support for the included access restrictions.
- To rebuild Tailwind CSS and TypeScript: Node.js 20+ and npm.

The site has no database dependency. Page and project content is stored in `includes/data.php` and individual PHP page files.

## Test locally in VS Code

1. Extract the ZIP into a working folder.
2. Open the folder in VS Code.
3. Open the VS Code terminal and run:

   ```bash
   php -S 127.0.0.1:8000
   ```

4. Open `http://127.0.0.1:8000/` in your browser. You can also open pages directly, such as `about.php`, `services-projects.php`, `photo.php`, `partner.php` and `contact.php`.

PHP's built-in server does not apply `.htaccess`; the protection rules are applied when hosted on compatible Apache/cPanel.

## Rebuild CSS and TypeScript (optional)

The shipped `assets/css/site.css` and `assets/js/app.js` are already usable; npm is not required to preview the website. To rebuild from source:

```bash
npm install
npm run build
```

Tailwind is configured in `tailwind.config.js`; the CSS source is `src/input.css`; the TypeScript source is `src/ts/app.ts`. The build commands write the compiled CSS and JavaScript to `assets/css/site.css` and `assets/js/app.js`.

## Upload to cPanel / Yegara

1. In cPanel File Manager, back up the current `public_html` folder before replacing anything.
2. Upload the ZIP prepared for cPanel and extract its contents in the domain’s document root (usually `public_html`). Make sure `index.php`, `.htaccess`, `assets/`, `includes/`, and `storage/` are directly inside that document root, not inside an extra `ocg-rebuild/` subfolder.
3. Confirm that `index.php`, `.htaccess`, `assets/`, `includes/`, and `storage/` are at the root of the deployed site.
4. Set the PHP version to PHP 8.1 or newer in cPanel MultiPHP Manager.
5. Confirm `storage/partner-uploads` is writable by PHP, but not world-writable. Recommended permissions are 750 or the hosting provider's advised value. Do not remove its `.htaccess` protection.
6. Test every page and form on the live hosting before switching DNS or replacing the live website.

## Email form configuration

Forms use PHP `mail()` and send to `OCG_CONTACT_EMAIL`, which defaults to `info@ocg.et`. On some hosts `mail()` may not deliver until the domain email account and outgoing mail settings are correctly configured. Test delivery on cPanel before launch. If your host requires authenticated SMTP, replace `safe_mail()` in `includes/functions.php` with a maintained SMTP library and credentials stored outside the public web root.

You can override the recipient and sender through hosting environment variables if your plan supports them:

- `OCG_CONTACT_EMAIL`
- `OCG_MAIL_FROM`

Do not put mail passwords or API keys into public PHP files or this ZIP.

## Images and source content

The current image tags use public images from OCG's existing media library at `ocg.gov.et/wp-content/uploads/...`. This lets you preview the project imagery while the old public media library remains online. If the old WordPress media folder will be removed during migration, download the approved original OCG images and update the URLs in `includes/data.php`, the page templates, `includes/page-hero.php` and the hero CSS in `assets/css/site.css`/`src/input.css` so the new site is self-contained.

Selected project text, service information, subsidiaries and contact details were reconstructed from publicly visible OCG pages. The new file set does not copy the original WordPress theme, plugins, admin accounts, or database. Verify figures, titles, leadership, image permissions and current project status with OCG before public launch. The live site showed incomplete placeholder content on some gallery/contact areas; the rebuilt video and document sections therefore clearly indicate where approved content still needs to be added.

## Main files

- `index.php` — home page
- `about.php`, `vision-mission.php`, `subsidiaries.php` — organization pages
- `services-projects.php`, `services.php`, `projects.php`, `why-choose-us.php` — services and project content
- `photo.php`, `video.php`, `events.php`, `documents.php`, `gallery.php` — gallery content
- `news.php`, `article.php` — news index and project article pages
- `contact.php`, `partner.php`, `survey.php` — forms
- `includes/header.php`, `includes/footer.php`, `includes/functions.php`, `includes/data.php` — shared layout, helpers and content data
- `assets/css/site.css`, `assets/js/app.js` — deployable frontend assets
- `src/input.css`, `src/ts/app.ts`, `tailwind.config.js`, `tsconfig.json`, `package.json` — source/build setup
# OCG-Website-Rebuild
