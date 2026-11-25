<?php
require_once __DIR__ . '/includes/data.php';
$slug = isset($_GET['slug']) ? substr(trim((string)$_GET['slug']), 0, 240) : '';
$article = $slug ? ocg_api_item('news', $slug) : null;
$pageTitle = $article['title'] ?? 'News article not found';
$pageDescription = $article ? ocg_excerpt($article['seoDescription'] ?? $article['summary'] ?? '', 180) : 'The requested article is not available.';
require __DIR__ . '/includes/header.php';
if (!$article) {
    http_response_code(404);
    echo '<main id="main-content"><section class="section"><div class="container empty-state"><h1>News article not found</h1><p>This article may be unpublished or the address may be incorrect.</p><a class="btn" href="news.php">Browse news</a></div></section></main>';
    require __DIR__ . '/includes/footer.php'; exit;
}
$image = ocg_media_url($article['featuredImage'] ?? null);
$related = ocg_api_content('news', ['limit'=>3, 'category'=>$article['category'] ?? ''])['items'] ?? [];
?>
<main id="main-content">
<?php if ($image): ?><section class="hero hero-inner-page" style="min-height:430px;background-image:linear-gradient(90deg,rgba(8,35,25,.92),rgba(18,59,43,.62)),url('<?= e($image) ?>')"><div class="hero-inner container"><div class="hero-copy"><span class="eyebrow eyebrow-light"><?= e($article['category'] ?? 'News') ?></span><h1><?= e($article['title']) ?></h1><p><?= e($article['summary'] ?? '') ?></p></div></div></section><?php endif; ?>
<section class="section"><div class="container">
  <div class="section-heading"><div><span class="eyebrow"><?= e($article['category'] ?? 'News') ?></span><h2><?= e($article['title']) ?></h2><p><?= e(ocg_format_date($article['publishedAt'] ?? null, true)) ?><?= !empty($article['authorName']) ? ' · ' . e($article['authorName']) : '' ?></p></div><a class="btn btn-outline" href="news.php">All news</a></div>
  <div class="article-body"><?= ocg_kses_post($article['content'] ?? '') ?></div>
  <?php if (!empty($article['images'])): ?><h2 style="margin-top:30px">Article gallery</h2><div class="gallery-grid"><?php foreach ($article['images'] as $image): $media = $image['mediaAsset'] ?? null; $url = ocg_media_url($media); if (!$url) continue; ?><a class="gallery-item" href="<?= e($url) ?>" target="_blank" rel="noopener"><img src="<?= e($url) ?>" alt="<?= e($image['altText'] ?? $article['title']) ?>" loading="lazy"><span class="gallery-caption"><strong><?= e($image['caption'] ?? $article['title']) ?></strong></span></a><?php endforeach; ?></div><?php endif; ?>
  <?php if (!empty($article['tags'])): ?><div class="chip-list" style="margin-top:24px"><?php foreach ($article['tags'] as $tag): ?><span class="chip"><?= e($tag) ?></span><?php endforeach; ?></div><?php endif; ?>
  <?php if ($related): ?><div style="margin-top:36px"><h2>Related articles</h2><div class="news-grid"><?php foreach (array_slice($related,0,3) as $item) { if (($item['slug'] ?? '') !== ($article['slug'] ?? '')) echo ocg_news_card($item); } ?></div></div><?php endif; ?>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>