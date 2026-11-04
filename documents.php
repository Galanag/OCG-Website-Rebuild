<?php
$pageTitle = 'Documents'; $pageDescription = 'Public documents and resources from OCG.';
$heroTitle = 'Documents & Resources'; $heroEyebrow = 'Gallery'; $heroText = 'A central place for approved public reports, documents and downloadable resources.'; $heroImage = '12/6.1-8.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container"><div class="tabs"><a class="tab" href="photo.php">Photos</a><a class="tab" href="video.php">Videos</a><a class="tab" href="events.php">Events</a><a class="tab active" href="documents.php">Documents</a></div><div class="empty-state"><h2>No public documents are listed here yet</h2><p>The existing Documents page did not expose downloadable resources during review. Add approved annual reports, brochures, policies or public notices in the document collection before launch.</p><a class="btn" href="contact.php">Request information <span aria-hidden="true">→</span></a></div></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
