<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Partner with OCG'; $pageDescription = 'Introduce a project, partnership opportunity or supplier service to Oro-Construction Group.';
$heroTitle = 'Partner with OCG'; $heroEyebrow = 'Let’s build together'; $heroText = 'Tell us about your organisation, capability or project and the kind of collaboration you would like to explore.'; $heroImage = '12/Walabu-Kegna.jpg';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        set_flash('error', 'Your form session expired. Please refresh the page and try again.');
    } elseif (!empty($_POST['website'])) {
        set_flash('success', 'Thank you.');
    } else {
        $first = clean_line((string)($_POST['first_name'] ?? ''), 80);
        $last = clean_line((string)($_POST['last_name'] ?? ''), 80);
        $org = clean_line((string)($_POST['organization'] ?? ''), 180);
        $email = clean_line((string)($_POST['email'] ?? ''), 190);
        $phone = clean_line((string)($_POST['phone'] ?? ''), 40);
        $country = clean_line((string)($_POST['country'] ?? ''), 80);
        $type = clean_line((string)($_POST['partner_type'] ?? 'Partnership enquiry'), 100);
        $websiteUrl = clean_line((string)($_POST['organization_website'] ?? ''), 200);
        $notes = clean_message((string)($_POST['notes'] ?? ''), 2500);
        $attachmentNote = 'No attachment';
        $uploadError = '';
        if (!empty($_FILES['attachment']['name']) && (int)($_FILES['attachment']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $file = $_FILES['attachment'];
            if ((int)$file['error'] !== UPLOAD_ERR_OK) $uploadError = 'The file upload failed. Please try again.';
            elseif ((int)$file['size'] > MAX_UPLOAD_BYTES) $uploadError = 'The attachment must be 5 MB or smaller.';
            else {
                $original = basename((string)$file['name']);
                $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
                $allowed = ['pdf','doc','docx','xls','xlsx','png','jpg','jpeg'];
                if (!in_array($ext, $allowed, true)) $uploadError = 'Allowed attachment types: PDF, Word, Excel, PNG and JPG.';
                else {
                    $mimeAllowed = [
                        'pdf' => ['application/pdf'],
                        'doc' => ['application/msword', 'application/octet-stream'],
                        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
                        'xls' => ['application/vnd.ms-excel', 'application/octet-stream'],
                        'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/octet-stream'],
                        'png' => ['image/png'],
                        'jpg' => ['image/jpeg'],
                        'jpeg' => ['image/jpeg'],
                    ];
                    $mime = '';
                    if (function_exists('finfo_open')) { $finfo = finfo_open(FILEINFO_MIME_TYPE); if ($finfo) { $mime = (string)finfo_file($finfo, (string)$file['tmp_name']); finfo_close($finfo); } }
                    if ($mime !== '' && !in_array($mime, $mimeAllowed[$ext] ?? [], true)) $uploadError = 'The uploaded file type does not match its extension.';
                }
                if ($uploadError === '') {
                    if (!is_dir(UPLOAD_DIR)) @mkdir(UPLOAD_DIR, 0750, true);
                    $safeName = bin2hex(random_bytes(16)) . '.' . $ext;
                    $dest = UPLOAD_DIR . DIRECTORY_SEPARATOR . $safeName;
                    if (!is_dir(UPLOAD_DIR) || !is_writable(UPLOAD_DIR) || !is_uploaded_file((string)$file['tmp_name']) || !move_uploaded_file((string)$file['tmp_name'], $dest)) $uploadError = 'The upload folder is not writable. Check storage/partner-uploads permissions in cPanel.';
                    else $attachmentNote = $original . ' (stored securely as ' . $safeName . ')';
                }
            }
        }
        if ($first === '' || $last === '' || $org === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $notes === '' || empty($_POST['consent'])) {
            set_flash('error', 'Please complete your name, organisation, valid email address and collaboration details.');
        } elseif ($uploadError !== '') {
            set_flash('error', $uploadError);
        } else {
            $body = "OCG website partnership request\n\nName: {$first} {$last}\nOrganisation: {$org}\nEmail: {$email}\nPhone: {$phone}\nCountry: {$country}\nRequest type: {$type}\nWebsite: {$websiteUrl}\nAttachment: {$attachmentNote}\n\nDetails:\n{$notes}\n\nReceived: " . date(DATE_ATOM);
            if (safe_mail('New OCG partnership request: ' . $type, $body, $email)) set_flash('success', 'Thank you. Your partnership enquiry has been sent to OCG.');
            else set_flash('error', 'Your request passed validation but email delivery is not configured on this server. Any attachment is stored in the protected storage/partner-uploads folder; configure cPanel email before launch.');
        }
    }
    header('Location: partner.php'); exit;
}
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container contact-grid"><div><span class="eyebrow">Build a relationship</span><h2 style="font-size:37px;line-height:1.15;letter-spacing:-.05em;margin:14px 0 22px">Bring your expertise to the table.</h2><p style="color:var(--muted)">OCG invites potential partners, suppliers, vendors, developers and specialist service providers to introduce their capabilities and identify areas for collaboration.</p><ul class="check-list"><li>Tell us what your organisation does</li><li>Describe a project or service opportunity</li><li>Attach a short capability statement if useful</li><li>Provide accurate contact details for follow-up</li></ul><div class="sidebar-card"><h3>Partnership enquiries</h3><p>For general questions, you can also email OCG directly.</p><a class="text-link" href="mailto:<?= e(SITE_EMAIL) ?>"><?= e(SITE_EMAIL) ?> <span aria-hidden="true">↗</span></a></div></div>
<form class="form-panel" action="partner.php" method="post" enctype="multipart/form-data"><h2>Partnership request</h2><p class="form-intro">Share a few details so OCG can understand your proposal.</p><?= csrf_field() ?><div class="hp-field" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><div class="form-grid">
<div class="form-field"><label for="first_name">First name <span>*</span></label><input id="first_name" name="first_name" required maxlength="80" autocomplete="given-name"></div>
<div class="form-field"><label for="last_name">Last name <span>*</span></label><input id="last_name" name="last_name" required maxlength="80" autocomplete="family-name"></div>
<div class="form-field full"><label for="organization">Organisation / company <span>*</span></label><input id="organization" name="organization" required maxlength="180" autocomplete="organization"></div>
<div class="form-field"><label for="email">Email address <span>*</span></label><input id="email" name="email" type="email" required maxlength="190" autocomplete="email"></div>
<div class="form-field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" maxlength="40" autocomplete="tel"></div>
<div class="form-field"><label for="country">Country</label><input id="country" name="country" maxlength="80" value="Ethiopia"></div>
<div class="form-field"><label for="partner_type">Type of enquiry</label><select id="partner_type" name="partner_type"><option>Business partnership</option><option>Supplier / vendor</option><option>Subcontractor</option><option>Project proposal</option><option>Investment / development</option><option>Professional services</option><option>Other</option></select></div>
<div class="form-field full"><label for="organization_website">Organisation website</label><input id="organization_website" name="organization_website" type="url" maxlength="200" placeholder="https://"></div>
<div class="form-field full"><label for="attachment">Capability statement or proposal</label><input id="attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"><div class="form-help">Optional · PDF, Word, Excel, PNG or JPG · Maximum 5 MB</div></div>
<div class="form-field full"><label for="notes">Describe your proposal <span>*</span></label><textarea id="notes" name="notes" required maxlength="2500" placeholder="Organisation overview, proposed collaboration, capabilities and any relevant project details…"></textarea><div class="form-help"><span data-char-count="notes">0</span> / 2500 characters</div></div></div><label class="checkbox-row"><input type="checkbox" name="consent" value="1" required><span>I confirm that the details provided may be used to assess and respond to this partnership request. See the <a href="privacy.php">website privacy notice</a>.</span></label><button class="btn" type="submit">Submit partnership request <span aria-hidden="true">→</span></button><p class="notice-legal" style="margin-top:14px">This form sends mail through the host’s PHP mail service. Outbound email and file-upload permissions must be tested in cPanel.</p></form></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
