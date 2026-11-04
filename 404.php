<?php
http_response_code(404);
$pageTitle = 'Page not found'; $pageDescription = 'The page you requested could not be found.';
$heroTitle = 'This page has moved'; $heroEyebrow = '404 · Not found'; $heroText = 'The address may be incorrect or the page may no longer be available. Use the links below to continue exploring OCG.'; $heroImage = '12/walmal-1024x576.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container" style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="index.php">Return home <span aria-hidden="true">→</span></a><a class="btn btn-outline" href="news.php">Browse updates</a><a class="btn btn-outline" href="contact.php">Contact OCG</a></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
