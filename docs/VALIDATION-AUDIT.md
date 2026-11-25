# Validation and Content Architecture Audit

## Executive result

The main cause of “The submitted data is invalid” was a mismatch between draft-first business requirements and schemas/UI that still required fields such as project reference, descriptions, category, location, news summary/content, event dates, and announcement summary/content. Empty optional values also reached the API as empty strings or were omitted inconsistently.

The API now returns field-level details, and the admin displays those details next to the relevant input. Required fields are limited to the business minimum. Optional values are normalized to empty/default values or null as appropriate.

## Problems discovered

| Area | Problem | Correction |
|---|---|---|
| Projects | Reference, descriptions, category, sector and location were required | Only title is required; reference is generated; other fields default or remain optional |
| Projects | Empty optional text could be omitted or violate required columns | Service normalizes empty text to defaults; update preserves existing values |
| Announcements | Summary/content were required for every category | Optional with empty defaults |
| Announcements | Vacancy/tender fields were not conditional | Create-time checks require position title only for vacancies and procurement category only for tenders |
| News | Summary/content/category were required | Title-only drafts are accepted; defaults applied |
| Events | Description/category/start/end were required | Title-only drafts accepted; dates and description optional |
| Numbers | Progress had no browser max and empty values were inconsistent | Empty values omitted/null; zero accepted; progress capped at 100 in UI and API |
| Dates | Empty date inputs could become invalid values | Empty dates omitted; API accepts null |
| Rich text | Empty content could fail min-length validation | Optional rich text normalizes to an empty string |
| Error display | Generic message only | API details are attached to the admin error and mapped to field-level messages |
| Forms | Large forms were flat | Logical sections with legends |
| Forms | No draft/publish distinction | Save Draft, Save Changes and Publish actions |
| Forms | No preview/removal | Image/file previews and remove controls |
| Forms | Unsaved changes could be lost silently | Dirty-state tracking and beforeunload warning |
| Attachments | Projects had gallery images but no document attachments | `ProjectAttachment` model, API endpoint and admin upload field |
| Public information architecture | Related pages were fragmented | About, Services & Projects and Photo Gallery consolidated with anchors and redirects |

## Minimum required fields

| Module | Minimum | Defaults |
|---|---|---|
| Project | Title | Reference `OCG-...`, status Proposed, draft, progress 0, category/sector/location defaults |
| Announcement | Title + category | Draft; summary/content empty; category-specific fields conditional |
| Vacancy | Title + category + position title | Other vacancy fields optional |
| Tender | Title + category + procurement category | Other tender fields optional |
| News | Title | Draft, slug generated, summary/content/category defaults |
| Event | Title | Draft, optional description/category/dates |
| Media | File | Public visibility by default; metadata optional |
| User | Name, email, temporary password, role | Must change password |
| Settings | Key and JSON value | Upsert by key |
| Submissions | Module-specific contact/partner/survey fields | Status New |

## Parent-child page map

| Parent | Former child | Anchor | Redirect |
|---|---|---|---|
| `about.php` | `vision-mission.php` | `#vision-mission` | 301 |
| `about.php` | `subsidiaries.php` | `#subsidiaries` | 301 |
| `services-projects.php` | `why-choose-us.php` | `#why-choose-us` | 301 |
| `photo.php` | `video.php` | `#videos` | 301 |
| `photo.php` | `documents.php` | `#documents` | 301 |

Projects, project details, announcements, vacancies, tenders, news, news details, events and event details remain independently accessible.

## In-page navigation

Consolidated pages include a sticky “On this page” navigation with anchor links, smooth scrolling, `scroll-margin-top` offsets, ARIA labels and IntersectionObserver active-section highlighting.

## Verification

- Backend integration suite: 13/13 tests passed.
- Browser admin test: title-only project draft created; seven project sections rendered; only title was required.
- Browser announcement test: vacancy fields required/visible for `JOB_VACANCY`; hidden and optional for `GENERAL_NOTICE`.
- Redirect checks: all five old URLs returned 301 to the expected parent anchors.
- About anchor check: `#subsidiaries` landed at 180px with the correct active navigation item.
- Responsive overflow audit: all public entry points at 320, 360, 390, 430, 768, 1024, 1280 and 1440px returned zero horizontal overflow failures.
- Screenshots: `/tmp/kilo/ocg-responsive/services-{390,768,1440}.png` and `about-{390,768,1440}.png`.

## Remaining limitations

The actual Yegara cPanel deployment, SMTP delivery, and a full third-party accessibility/penetration audit remain outside this local verification. No database records, administrator credentials, migrations, audit history or authentication protections were reset or removed.