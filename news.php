<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'News & Updates'; $pageDescription = 'Latest public project announcements and updates from Oro-Construction Group.';
$heroTitle = 'News & Updates'; $heroEyebrow = 'From OCG'; $heroText = 'Project updates and public information on construction, infrastructure and development activities.'; $heroImage = '12/photo_2025-12-17_14-55-02-1024x768.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content"><section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Project updates</span><h2>Stories from our work.</h2><p>The initial collection reflects selected articles visible on the current OCG website. New posts can be added to the project data file.</p></div></div><div class="news-grid"><?php foreach ($projects as $project): ?><article class="news-card"><a class="news-card-img" href="article.php?slug=<?= e($project['slug']) ?>"><img src="<?= e(image_url($project['image'])) ?>" alt="<?= e($project['title']) ?>" loading="lazy"></a><div class="news-card-content"><div class="news-meta"><?= e($project['category']) ?> · <?= e($project['date']) ?></div><h2><a href="article.php?slug=<?= e($project['slug']) ?>"><?= e($project['title']) ?></a></h2><p><?= e($project['excerpt']) ?></p><a class="text-link" href="article.php?slug=<?= e($project['slug']) ?>">Read update <span aria-hidden="true">→</span></a></div></article><?php endforeach; ?></div></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
