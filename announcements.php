<?php
require_once __DIR__ . '/includes/data.php';
$forceKind = $forceKind ?? '';
$forceTitle = $forceTitle ?? 'Announcements';
$pageTitle = $forceKind === 'vacancy' ? 'Vacancies' : ($forceKind === 'tender' ? 'Bids & Tenders' : 'Announcements');
$pageDescription = 'Current OCG job vacancies, bids, tenders, procurement notices and corporate announcements.';
$heroTitle = $pageTitle;
$heroEyebrow = $forceKind === 'vacancy' ? 'Careers at OCG' : ($forceKind === 'tender' ? 'Business opportunities' : 'Corporate notices');
$heroText = $forceKind === 'vacancy' ? 'Explore current vacancies and application instructions from Oro-Construction Group.' : ($forceKind === 'tender' ? 'Review open tenders, procurement notices and submission requirements.' : 'Find published OCG announcements, deadlines, documents and application instructions.');
$heroImage = '12/6.1-8.webp';
require __DIR__ . '/includes/header.php';
require __DIR__ . '/includes/page-hero.php';
$page = max(1, (int)($_GET['page'] ?? 1));
$params = ['limit' => 12, 'page' => $page, 'sort' => '-publishedAt'];
if ($forceKind) $params['kind'] = $forceKind;
if (!empty($_GET['q'])) $params['q'] = substr(trim($_GET['q']), 0, 200);
if (!empty($_GET['category'])) $params['category'] = preg_replace('/[^A-Z_]/', '', strtoupper($_GET['category']));
if (!empty($_GET['state'])) $params['state'] = preg_replace('/[^A-Z_]/', '', strtoupper($_GET['state']));
$data = ocg_api_content('announcements', $params);
$items = $data['items'] ?? [];
$meta = $data['meta'] ?? ['page' => 1, 'pages' => 1];
?>
<main id="main-content">
<section class="section"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Published notices</span><h2><?= e($forceKind === 'vacancy' ? 'Open vacancies' : ($forceKind === 'tender' ? 'Tender notices' : 'Corporate announcements')) ?></h2><p>Deadlines and states are derived from the publication record. Expired notices remain available as historical records.</p></div></div>
  <form class="filter-bar" method="get" action="<?= e($forceKind === 'vacancy' ? 'vacancies.php' : ($forceKind === 'tender' ? 'tenders.php' : 'announcements.php')) ?>">
    <label class="sr-only" for="announcement-search">Search announcements</label><input id="announcement-search" name="q" value="<?= e($_GET['q'] ?? '') ?>" placeholder="Search notices">
    <label class="sr-only" for="announcement-category">Category</label><select id="announcement-category" name="category"><option value="">All categories</option><?php foreach (ocg_announcement_categories() as $value => $label): ?><option value="<?= e($value) ?>" <?= (($_GET['category'] ?? '') === $value) ? 'selected' : '' ?>><?= e($label) ?></option><?php endforeach; ?></select>
    <label class="sr-only" for="announcement-state">Deadline state</label><select id="announcement-state" name="state"><option value="">All states</option><?php foreach (['OPEN'=>'Open','CLOSED'=>'Closed','UPCOMING'=>'Upcoming'] as $value => $label): ?><option value="<?= e($value) ?>" <?= (($_GET['state'] ?? '') === $value) ? 'selected' : '' ?>><?= e($label) ?></option><?php endforeach; ?></select>
    <button class="btn" type="submit">Filter</button><a class="btn btn-outline" href="<?= e($forceKind === 'vacancy' ? 'vacancies.php' : ($forceKind === 'tender' ? 'tenders.php' : 'announcements.php')) ?>">Clear</a>
  </form>
  <?php if ($items): ?><div class="notice-grid"><?php foreach ($items as $item) { echo ocg_announcement_card($item); } ?></div><?php elseif (!$data): ?>
    <div class="notice-grid"><?php foreach ($notices as $notice): ?><a class="notice" href="contact.php"><span>New</span><h3><?= e($notice['title']) ?></h3><p><?= e(ocg_excerpt($notice['summary'], 160)) ?></p><strong><?= e($notice['url']) ?></strong></a><?php endforeach; ?></div>
    <p class="notice-legal">The live CMS is temporarily unavailable; the original public notices are shown above.</p>
  <?php else: ?><div class="empty-state"><h2>No announcements match these filters</h2><p>Try a different category, deadline state or search term.</p></div><?php endif; ?>
  <?= ocg_pagination((int)$meta['page'], (int)$meta['pages'], $forceKind === 'vacancy' ? 'vacancies.php' : ($forceKind === 'tender' ? 'tenders.php' : 'announcements.php')) ?>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>