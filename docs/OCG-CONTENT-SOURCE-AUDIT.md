# OCG Content Source Audit

## Sources inspected

1. `Draft Oro-Construction_Group_Company_Profile-v2.pptx`
   - 11 slides.
   - Company Profile & 2019 Strategic Outlook.
   - Historical 2018 performance, 2019 (2026/2027) plan, governance, operations, clients, financial trajectory and six pillars.
2. `OCG Profile Nw.pdf`
   - Newer company profile.
   - About, vision/mission/values, board, historical CEO message, subsidiary profiles, FY 2026/2027 targets, quality/certifications, backlog and financial outlook.
3. User-supplied official profile text.
   - Used as the migration reference, including exact FY 2026/2027 subsidiary revenue and gross-profit targets.

Both source files were available outside the repository in the Telegram downloads folder. They were not copied into the public web root.

## Pages updated

- `index.php`
- `about.php`
- `subsidiaries.php`
- `services-projects.php`
- `financial-performance.php` (new)
- `contact.php`
- `includes/config.php`
- `includes/data.php` (existing records retained)
- `includes/header.php`
- `includes/footer.php`
- `sitemap.xml`

## Reporting periods

| Content | Label used |
|---|---|
| 2015–2018 revenue, assets, profit | Historical Financial Performance / 2018 Actual Performance |
| 2018 asset base | 2018 projection |
| 77.7B ETB backlog | Reported Project Backlog |
| FY 2026/2027 subsidiary and group figures | FY 2026/2027 Strategic Targets |
| 2018 CEO message | Historical CEO message — 2018 performance |
| Board/executives | Reported profile; appointment dates require confirmation |

The PPTX’s “2019 (2026/2027)” wording is preserved in the source audit. The website does not describe the 39.32B ETB revenue or 7.07B ETB gross-profit figures as achieved results.

## Contradictions and approval items

1. The PPTX labels the 39.32B/7.07B plan as 2019 (2026/2027), while the newer PDF presents FY 2026/2027 subsidiary targets.
2. OCC is described as established in 2020 but has reported 2018 financial performance.
3. IJA has 2018 financial data alongside Regulation No. 1243/2020 and January 2026 re-establishment statements.
4. Board and executive appointment dates are not consistently supplied.
5. The existing website had different contact details (`info@ocg.et`, Bole Michael) from the official profile (`OCG2021@gmail.com`, Bole Michael next to Airport Cargo, phone +251 99 434 4127, official map).
6. ISO claims are limited to OCC (triple certification) and ECO (ISO 9001:2015); no group-wide certification claim is made.
7. The PPTX contains a general “triple ISO-certified” phrase, but the subsidiary-specific section limits the named certifications.
8. Workforce (5,200+) and backlog (77.7B ETB) reporting dates are not stated precisely.
9. The PDF has OCR/layout warnings and some text-column interleaving; the supplied profile text was used where extraction was ambiguous.
10. The existing website domain/hosting remains unchanged; `www.ocg.et` is presented as the company-profile website, not as a replacement deployment target.

See `OCG-CONTENT-APPROVAL-REGISTER.md` for the management decision log.

## Content safety

- No fictional testimonials, portraits, CSR budgets, project names or certificates were created.
- Existing CMS projects, news, events, submissions and administrator accounts are not overwritten.
- The corporate seed is create-only and can be rerun without replacing administrator edits.