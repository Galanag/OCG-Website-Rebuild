<?php
require_once __DIR__ . '/functions.php';
$pageTitle = $pageTitle ?? SITE_NAME;
$pageDescription = $pageDescription ?? SITE_TAGLINE;
$bodyClass = $bodyClass ?? '';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#123b2b">
  <meta name="description" content="<?= e($pageDescription) ?>">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="<?= e(SITE_NAME) ?>">
  <meta property="og:title" content="<?= e($pageTitle) ?> | <?= e(SITE_SHORT_NAME) ?>">
  <meta property="og:description" content="<?= e($pageDescription) ?>">
  <meta name="robots" content="index,follow">
  <title><?= e($pageTitle) ?> | <?= e(SITE_SHORT_NAME) ?></title>
  <link rel="icon" href="assets/img/ocg-logo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://ocg.gov.et" crossorigin>
  <link rel="preconnect" href="https://ocg.ijadevelopers.com" crossorigin>
  <link rel="stylesheet" href="assets/css/site.css">
  <script src="assets/js/app.js" defer></script>
</head>
<body class="<?= e($bodyClass) ?>">
<a class="skip-link" href="#main-content">Skip to content</a>
<div class="topbar">
  <div class="container topbar-inner">
    <span><span class="topbar-dot"></span><?= e(SITE_ADDRESS) ?></span>
    <a href="mailto:<?= e(SITE_EMAIL) ?>"><?= e(SITE_EMAIL) ?></a>
  </div>
</div>
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="index.php" aria-label="OCG home"><img src="assets/img/ocg-logo.svg" alt="Oro-Construction Group" width="255" height="62"></a>
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span><span></span><b class="sr-only">Toggle navigation</b></button>
    <nav class="primary-nav" id="primary-navigation" data-navigation aria-label="Primary navigation">
      <a class="nav-link <?= nav_is_active(['index.php']) ? 'active' : '' ?>" href="index.php">Home</a>
      <div class="nav-dropdown" data-dropdown>
        <button class="nav-link nav-dropdown-trigger <?= nav_is_active(['about.php','vision-mission.php','subsidiaries.php']) ? 'active' : '' ?>" type="button" aria-expanded="false" data-dropdown-toggle>About Us <span class="chevron">⌄</span></button>
        <div class="dropdown-panel">
          <a href="about.php">Who We Are &amp; Leadership</a>
          <a href="vision-mission.php">Vision &amp; Mission</a>
          <a href="subsidiaries.php">Our Subsidiaries</a>
        </div>
      </div>
      <a class="nav-link <?= nav_is_active(['services-projects.php','services.php','projects.php','why-choose-us.php']) ? 'active' : '' ?>" href="services-projects.php">Services &amp; Projects</a>
      <div class="nav-dropdown" data-dropdown>
        <button class="nav-link nav-dropdown-trigger <?= nav_is_active(['gallery.php','photo.php','video.php','events.php','documents.php']) ? 'active' : '' ?>" type="button" aria-expanded="false" data-dropdown-toggle>Gallery <span class="chevron">⌄</span></button>
        <div class="dropdown-panel">
          <a href="photo.php">Photo Gallery</a>
          <a href="video.php">Videos</a>
          <a href="events.php">Events</a>
          <a href="documents.php">Documents</a>
        </div>
      </div>
      <a class="nav-link <?= nav_is_active(['news.php','article.php']) ? 'active' : '' ?>" href="news.php">News &amp; Updates</a>
      <a class="nav-link <?= nav_is_active(['contact.php']) ? 'active' : '' ?>" href="contact.php">Contact</a>
      <a class="nav-cta" href="partner.php">Partner with us <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
</header>
<?php render_flash(); ?>
