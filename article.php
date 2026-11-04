<?php
require_once __DIR__ . '/includes/data.php';
$slug = (string)($_GET['slug'] ?? '');
$project = null;
foreach ($projects as $item) { if (hash_equals((string)$item['slug'], $slug)) { $project = $item; break; } }
if (!$project) { http_response_code(404); $pageTitle = 'Update not found'; } else { $pageTitle = $project['title']; }
$pageDescription = $project['excerpt'] ?? 'OCG public project update.';
require __DIR__ . '/includes/header.php';
?>
<?php if (!$project): ?>
<?php $heroTitle = 'Page not found'; $heroEyebrow = '404'; $heroText = 'This project update could not be found. Browse the current updates or return to OCG’s home page.'; $heroImage = '12/walmal-1024x576.webp'; require __DIR__ . '/includes/page-hero.php'; ?>
<main id="main-content"><section class="section"><div class="container"><a class="btn" href="news.php">Back to updates <span aria-hidden="true">→</span></a></div></section></main>
<?php else: ?>
<main id="main-content"><section class="section"><div class="container article-layout"><article class="article-body"><div class="eyebrow"><?= e($project['category']) ?></div><h1 class="article-title"><?= e($project['title']) ?></h1><div class="article-meta">Published <?= e($project['date']) ?> · Oro-Construction Group</div><img class="article-cover" src="<?= e(image_url($project['image'])) ?>" alt="<?= e($project['title']) ?>" loading="lazy"><p><?= e($project['body']) ?></p><p class="notice-legal">This summary is based on the article currently available on OCG’s public website. Confirm project facts and current status with the relevant OCG team before using this page as a formal project record.</p><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:27px"><a class="btn btn-outline" href="news.php">← All updates</a><a class="btn" href="contact.php">Contact OCG <span aria-hidden="true">→</span></a></div></article><aside><div class="sidebar-card"><h3>About OCG</h3><p>OCG brings together specialist construction, engineering and development capabilities in support of communities across Ethiopia.</p><a class="text-link" href="about.php">Who we are <span aria-hidden="true">→</span></a></div><div class="sidebar-card"><h3>Related updates</h3><?php foreach ($projects as $item): if ($item['slug'] === $project['slug']) continue; ?><p><a href="article.php?slug=<?= e($item['slug']) ?>"><strong><?= e($item['title']) ?></strong></a><br><span class="notice-legal"><?= e($item['date']) ?></span></p><?php endforeach; ?></div></aside></div></section></main>
<?php endif; ?>
<?php require __DIR__ . '/includes/footer.php'; ?>
