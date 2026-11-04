<?php
$pageTitle = 'Videos'; $pageDescription = 'Video gallery for public OCG project and event media.';
$heroTitle = 'Videos'; $heroEyebrow = 'Gallery'; $heroText = 'Video updates, project highlights and event coverage from OCG.'; $heroImage = '12/walmal-1024x576.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container"><div class="tabs"><a class="tab" href="photo.php">Photos</a><a class="tab active" href="video.php">Videos</a><a class="tab" href="events.php">Events</a><a class="tab" href="documents.php">Documents</a></div><div class="empty-state"><h2>Video library ready for publication</h2><p>The current public Videos page did not expose a usable list of video items during review. Add approved video URLs or upload video files to publish this section.</p><a class="btn" href="contact.php">Contact the communications team <span aria-hidden="true">→</span></a></div></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
