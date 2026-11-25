<?php
require_once __DIR__ . '/includes/data.php';
$slug = isset($_GET['slug']) ? substr(trim((string)$_GET['slug']), 0, 240) : '';
$project = $slug ? ocg_api_item('projects', $slug) : null;
$pageTitle = $project['title'] ?? 'Project not found';
$pageDescription = $project ? ocg_excerpt($project['shortDescription'] ?? $project['description'] ?? '', 180) : 'The requested project is not available.';
require __DIR__ . '/includes/header.php';
if (!$project) {
    http_response_code(404);
    echo '<main id="main-content"><section class="section"><div class="container empty-state"><h1>Project not found</h1><p>This project may be unpublished or the address may be incorrect.</p><a class="btn" href="projects.php">Browse projects</a></div></section></main>';
    require __DIR__ . '/includes/footer.php';
    exit;
}
$status = $project['status'] ?? 'PROPOSED';
$progress = (int)($project['progress'] ?? 0);
$gallery = $project['images'] ?? [];
$history = $project['statusHistory'] ?? [];
?>
<main id="main-content">
<section class="hero hero-inner-page" style="min-height:460px;background-image:linear-gradient(90deg,rgba(8,35,25,.94),rgba(18,59,43,.72)),url('<?= e(ocg_project_image($project)) ?>')">
  <div class="hero-inner container"><div class="hero-copy"><span class="eyebrow eyebrow-light"><?= e($project['category'] ?? 'Project') ?></span><h1><?= e($project['title']) ?></h1><p><?= e($project['shortDescription'] ?? '') ?></p><div class="hero-actions"><span class="<?= ocg_status_class($status) ?>"><?= e(ocg_status_label($status)) ?></span><span class="hero-cta-note"><?= e($project['location'] ?? '') ?><?= !empty($project['region']) ? ', ' . e($project['region']) : '' ?></span></div></div></div>
</section>
<section class="section"><div class="container detail-layout">
  <article class="article-body">
    <span class="eyebrow">Project <?= e($project['reference'] ?? '') ?></span>
    <h2>Project overview</h2>
    <?= ocg_kses_post($project['description'] ?? '') ?>
    <?php if ($gallery): ?>
      <h2>Project gallery</h2><div class="gallery-grid"><?php foreach ($gallery as $image): $media = $image['mediaAsset'] ?? null; $url = ocg_media_url($media); if (!$url) continue; ?>
        <a class="gallery-item" href="<?= e($url) ?>" target="_blank" rel="noopener"><img src="<?= e($url) ?>" alt="<?= e($image['altText'] ?? $project['title']) ?>" loading="lazy"><span class="gallery-caption"><strong><?= e($image['caption'] ?? $project['title']) ?></strong></span></a>
      <?php endforeach; ?></div>
    <?php endif; ?>
    <?php if ($history): ?>
      <h2>Project timeline</h2><div class="article-body"><?php foreach (array_slice($history, 0, 10) as $entry): ?><div class="news-card-head"><span><?= e(ocg_status_label($entry['previousStatus'] ?? 'New')) ?><?= !empty($entry['previousStatus']) ? ' → ' : '' ?><?= e(ocg_status_label($entry['newStatus'] ?? '')) ?></span><span><?= e(ocg_format_date($entry['changedAt'] ?? null, true)) ?></span></div><?php if (!empty($entry['note'])): ?><p><?= e($entry['note']) ?></p><?php endif; ?><?php endforeach; ?></div>
    <?php endif; ?>
  </article>
  <aside class="detail-sidebar">
    <div class="project-card-body"><span class="eyebrow">At a glance</span><h2>Project details</h2>
      <div class="stats-grid" style="grid-template-columns:1fr 1fr;gap:10px;margin:14px 0"><div><span class="eyebrow">Progress</span><strong><?= $progress ?>%</strong></div><div><span class="eyebrow">Status</span><strong><?= e(ocg_status_label($status)) ?></strong></div></div>
      <?= ocg_progress_bar($progress) ?>
      <div class="contact-list" style="margin-top:18px">
        <?php foreach (['Client'=>'client','Contractor'=>'contractor','Consultant'=>'consultant','Project manager'=>'projectManager','Funding source'=>'fundingSource','Contract type'=>'contractType','Location'=>'location','Region'=>'region','Country'=>'country','Start date'=>'startDate','Planned completion'=>'plannedCompletionDate','Actual completion'=>'actualCompletionDate'] as $label => $key): if (($project[$key] ?? null) === null || ($project[$key] ?? '') === '') continue; $value = $project[$key]; if (str_contains($key, 'date') || in_array($key, ['startDate','plannedCompletionDate','actualCompletionDate'], true)) { $value = ocg_format_date($value); } ?>
          <p><span><?= e($label) ?></span><strong><?= e($value) ?></strong></p>
        <?php endforeach; ?>
        <?php if (!empty($project['contractValue'])): ?><p><span>Contract value</span><strong><?= e(number_format((float)$project['contractValue'], 2)) ?> <?= e($project['currency'] ?? 'ETB') ?></strong></p><?php endif; ?>
      </div>
      <?php if (!empty($project['latitude']) && !empty($project['longitude'])): ?><a class="btn btn-outline" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=<?= e($project['latitude']) ?>&mlon=<?= e($project['longitude']) ?>#map=13/<?= e($project['latitude']) ?>/<?= e($project['longitude']) ?>">View location ↗</a><?php endif; ?>
    </div>
  </aside>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>