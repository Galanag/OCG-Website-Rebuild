<?php
$pageTitle = 'News & Updates'; $pageDescription = 'News, project milestones and updates from OCG and its subsidiaries.'; $heroTitle = 'News & Updates'; $heroEyebrow = 'From across OCG'; $heroText = 'Project milestones, corporate updates and stories connected with OCG’s work across Ethiopia.'; $heroImage = '12/ocg-board-1024x558.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$page = max(1, (int)($_GET['page'] ?? 1));
$params = ['limit' => 12, 'page' => $page, 'sort' => '-publishedAt'];
if (!empty($_GET['q'])) $params['q'] = substr(trim($_GET['q']), 0, 200);
if (!empty($_GET['category'])) $params['category'] = substr(trim($_GET['category']), 0, 120);
$data = ocg_api_content('news', $params);
$items = $data['items'] ?? [];
$meta = $data['meta'] ?? ['page'=>1,'pages'=>1];
?>
<main id="main-content">
<section class="section"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Latest updates</span><h2>Published news</h2><p>News and project stories managed through the OCG CMS.</p></div></div>
  <form class="filter-bar" method="get" action="news.php">
    <label class="sr-only" for="news-search">Search news</label><input id="news-search" name="q" value="<?= e($_GET['q'] ?? '') ?>" placeholder="Search news">
    <label class="sr-only" for="news-category">News category</label><input id="news-category" name="category" value="<?= e($_GET['category'] ?? '') ?>" placeholder="Category">
    <button class="btn" type="submit">Filter</button><a class="btn btn-outline" href="news.php">Clear</a>
  </form>
  <?php if ($items): ?><div class="news-grid"><?php foreach ($items as $item) { echo ocg_news_card($item); } ?></div>
  <?php elseif (!$data): ?>
    <div class="news-grid"><?php foreach ($updates as $article): ?>
      <article class="article-card"><?php if (!empty($article['image'])): ?><img src="<?= e(image_url($article['image'])) ?>" alt="OCG project update" loading="lazy"><?php endif; ?><span>Project update</span><h3><?= e($article['title']) ?></h3><p><?= e(ocg_excerpt($article['content'], 145)) ?></p><a class="text-link" href="article.php?slug=<?= e($article['slug']) ?>">Read more <span aria-hidden="true">→</span></a></article>
    <?php endforeach; ?></div><p class="notice-legal">The live CMS is temporarily unavailable; the original public news items are shown above.</p>
  <?php else: ?><div class="empty-state"><h2>No news matches these filters</h2><p>Try a different search term or category.</p></div><?php endif; ?>
  <?= ocg_pagination((int)$meta['page'], (int)$meta['pages'], 'news.php') ?>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>