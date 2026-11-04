<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Feedback Survey'; $pageDescription = 'Share feedback about OCG public information and service experience.';
$heroTitle = 'Share your feedback'; $heroEyebrow = 'Survey'; $heroText = 'Your feedback can help OCG improve how it communicates and responds to public enquiries.'; $heroImage = '12/6.1-8.webp';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) set_flash('error', 'Your form session expired. Please refresh the page and try again.');
    elseif (!empty($_POST['website'])) set_flash('success', 'Thank you.');
    else {
        $name = clean_line((string)($_POST['name'] ?? ''), 100);
        $email = clean_line((string)($_POST['email'] ?? ''), 190);
        $area = clean_line((string)($_POST['area'] ?? ''), 100);
        $rating = clean_line((string)($_POST['rating'] ?? ''), 20);
        $feedback = clean_message((string)($_POST['feedback'] ?? ''), 2000);
        if ($area === '' || $rating === '' || $feedback === '' || ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL))) set_flash('error', 'Please select a topic and rating, add your feedback and check the email address if provided.');
        else {
            $body = "OCG public website feedback\n\nName: {$name}\nEmail: {$email}\nFeedback area: {$area}\nRating: {$rating}\n\nFeedback:\n{$feedback}\n\nReceived: " . date(DATE_ATOM);
            if (safe_mail('OCG website feedback survey', $body, $email ?: null)) set_flash('success', 'Thank you for taking the time to share your feedback.');
            else set_flash('error', 'Your feedback is valid, but email delivery is not configured on this server yet.');
        }
    }
    header('Location: survey.php'); exit;
}
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container" style="max-width:850px"><div class="form-panel"><h2>OCG website feedback</h2><p class="form-intro">The existing Survey page asks visitors to select a survey but does not expose a working questionnaire. This rebuild includes a basic general feedback form that can be replaced by OCG’s approved survey.</p><form action="survey.php" method="post"><?= csrf_field() ?><div class="hp-field" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><div class="form-grid"><div class="form-field"><label for="name">Name (optional)</label><input id="name" name="name" maxlength="100" autocomplete="name"></div><div class="form-field"><label for="email">Email (optional)</label><input id="email" name="email" type="email" maxlength="190" autocomplete="email"></div><div class="form-field"><label for="area">What is your feedback about? <span>*</span></label><select id="area" name="area" required><option value="">Choose a topic</option><option>Website information</option><option>Project information</option><option>Contact and response</option><option>Partnership process</option><option>Accessibility and usability</option><option>Other</option></select></div><div class="form-field"><label for="rating">How was your experience? <span>*</span></label><select id="rating" name="rating" required><option value="">Choose a rating</option><option>Very good</option><option>Good</option><option>Average</option><option>Poor</option><option>Very poor</option></select></div><div class="form-field full"><label for="feedback">Your feedback <span>*</span></label><textarea id="feedback" name="feedback" required maxlength="2000" placeholder="What worked well? What could be improved?"></textarea><div class="form-help"><span data-char-count="feedback">0</span> / 2000 characters</div></div></div><button class="btn" type="submit">Submit feedback <span aria-hidden="true">→</span></button></form></div></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
