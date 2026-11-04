<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Contact OCG'; $pageDescription = 'Contact Oro-Construction Group in Addis Ababa, Ethiopia, for public information and project enquiries.';
$heroTitle = 'Contact OCG'; $heroEyebrow = 'Get in touch'; $heroText = 'For general enquiries, project discussions or information about OCG, use the details or enquiry form below.'; $heroImage = '12/6.1-8.webp';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        set_flash('error', 'Your form session expired. Please refresh the page and try again.');
    } elseif (!empty($_POST['website'])) {
        set_flash('success', 'Thank you.');
    } else {
        $first = clean_line((string)($_POST['first_name'] ?? ''), 80);
        $last = clean_line((string)($_POST['last_name'] ?? ''), 80);
        $email = clean_line((string)($_POST['email'] ?? ''), 190);
        $phone = clean_line((string)($_POST['phone'] ?? ''), 40);
        $subject = clean_line((string)($_POST['subject'] ?? 'General enquiry'), 120);
        $message = clean_message((string)($_POST['message'] ?? ''), 2500);
        if ($first === '' || $last === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '' || empty($_POST['consent'])) {
            set_flash('error', 'Please complete all required fields and enter a valid email address.');
        } else {
            $body = "OCG website contact enquiry\n\nName: {$first} {$last}\nEmail: {$email}\nPhone: {$phone}\nSubject: {$subject}\n\nMessage:\n{$message}\n\nReceived: " . date(DATE_ATOM);
            if (safe_mail('New website enquiry: ' . $subject, $body, $email)) {
                set_flash('success', 'Thank you for contacting OCG. Your enquiry has been sent.');
            } else {
                set_flash('error', 'Your form is valid, but email delivery is not configured on this server yet. Configure outgoing email on the host before publishing the form.');
            }
        }
    }
    header('Location: contact.php'); exit;
}
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container contact-grid"><div><span class="eyebrow">Contact details</span><h2 style="font-size:37px;line-height:1.15;letter-spacing:-.05em;margin:14px 0 22px">We’re ready to hear from you.</h2><p style="color:var(--muted);margin:0 0 24px">Send your enquiry and include enough detail for the relevant team to respond appropriately.</p>
  <div class="contact-card"><div class="contact-icon" aria-hidden="true">✉</div><div><h3>Email</h3><a href="mailto:<?= e(SITE_EMAIL) ?>"><?= e(SITE_EMAIL) ?></a></div></div>
  <div class="contact-card"><div class="contact-icon" aria-hidden="true">⌖</div><div><h3>Head office</h3><p><?= e(SITE_ADDRESS) ?></p></div></div>
  <div class="contact-card"><div class="contact-icon" aria-hidden="true">↗</div><div><h3>Project &amp; partnership enquiries</h3><p>Choose a clear subject and describe your organisation or project.</p><a href="partner.php">Open partnership form →</a></div></div>
  <div class="map-panel"><div><strong>OCG Head Office</strong><p><?= e(SITE_ADDRESS) ?></p><a class="text-link" target="_blank" rel="noopener" href="https://maps.google.com/?q=Bole+Michael,+Addis+Ababa,+Ethiopia">Open map directions <span aria-hidden="true">↗</span></a></div></div>
</div><form class="contact-form" action="contact.php" method="post"><h2>Send an enquiry</h2><p class="form-intro">Fields marked with <span style="color:var(--red)">*</span> are required.</p><?= csrf_field() ?><div class="hp-field" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
  <div class="form-grid"><div class="form-field"><label for="first_name">First name <span>*</span></label><input id="first_name" name="first_name" required maxlength="80" autocomplete="given-name" placeholder="First name"></div><div class="form-field"><label for="last_name">Last name <span>*</span></label><input id="last_name" name="last_name" required maxlength="80" autocomplete="family-name" placeholder="Last name"></div><div class="form-field"><label for="email">Email address <span>*</span></label><input id="email" name="email" type="email" required maxlength="190" autocomplete="email" placeholder="name@example.com"></div><div class="form-field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" maxlength="40" autocomplete="tel" placeholder="Optional"></div><div class="form-field full"><label for="subject">Enquiry topic</label><select id="subject" name="subject"><option>General enquiry</option><option>Project information</option><option>Business partnership</option><option>Supplier or contractor</option><option>Media and communications</option><option>Other</option></select></div><div class="form-field full"><label for="message">How can we help? <span>*</span></label><textarea id="message" name="message" required maxlength="2500" placeholder="Please describe your enquiry…"></textarea><div class="form-help"><span data-char-count="message">0</span> / 2500 characters</div></div></div><label class="checkbox-row"><input type="checkbox" name="consent" value="1" required><span>I understand the information I provide will be used to respond to this enquiry. See the <a href="privacy.php">website privacy notice</a>.</span></label><button class="btn" type="submit">Send message <span aria-hidden="true">→</span></button><p class="notice-legal" style="margin-top:15px">Messages are sent to <?= e(SITE_EMAIL) ?> through PHP mail(). Confirm outbound email works on cPanel before publishing.</p></form></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
