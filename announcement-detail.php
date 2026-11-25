<?php
require_once __DIR__ . '/includes/data.php';
$slug = isset($_GET['slug']) ? substr(trim((string)$_GET['slug']), 0, 240) : '';
$announcement = $slug ? ocg_api_item('announcements', $slug) : null;
$pageTitle = $announcement['title'] ?? 'Announcement not found';
$pageDescription = $announcement ? ocg_excerpt($announcement['summary'] ?? '', 180) : 'The requested announcement is not available.';
require __DIR__ . '/includes/header.php';
if (!$announcement) {
    http_response_code(404);
    echo '<main id="main-content"><section class="section"><div class="container empty-state"><h1>Announcement not found</h1><p>This notice may be unpublished or the address may be incorrect.</p><a class="btn" href="announcements.php">Browse announcements</a></div></section></main>';
    require __DIR__ . '/includes/footer.php'; exit;
}
$state = $announcement['state'] ?? 'OPEN';
$deadline = $announcement['submissionDeadline'] ?? $announcement['deadline'] ?? null;
$attachments = $announcement['attachments'] ?? [];
?>
<main id="main-content">
<section class="hero hero-inner-page" style="min-height:390px;background-image:linear-gradient(90deg,rgba(8,35,25,.95),rgba(18,59,43,.72)),url('<?= e(image_url('12/6.1-8.webp')) ?>')">
  <div class="hero-inner container"><div class="hero-copy"><span class="eyebrow eyebrow-light"><?= e(ocg_status_label($announcement['category'] ?? 'GENERAL_NOTICE')) ?></span><h1><?= e($announcement['title']) ?></h1><p><?= e($announcement['summary'] ?? '') ?></p><div class="hero-actions"><span class="<?= ocg_status_class($state) ?>"><?= e(ocg_status_label($state)) ?></span><?php if ($deadline): ?><span class="hero-cta-note">Deadline: <?= e(ocg_format_date($deadline, true)) ?></span><?php endif; ?></div></div></div>
</section>
<section class="section"><div class="container detail-layout">
  <article class="article-body">
    <span class="eyebrow"><?= e($announcement['reference'] ?? 'Corporate announcement') ?></span>
    <h2>Notice details</h2>
    <?= ocg_kses_post($announcement['content'] ?? '') ?>
    <?php if (!empty($announcement['applicationInstructions'])): ?><h2>Application / submission instructions</h2><p style="white-space:pre-line"><?= e($announcement['applicationInstructions']) ?></p><?php endif; ?>
    <?php if (!empty($announcement['positionTitle'])): ?>
      <h2>Vacancy information</h2><div class="stats-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:18px">
        <div><span class="eyebrow">Position</span><strong><?= e($announcement['positionTitle']) ?></strong></div><div><span class="eyebrow">Department</span><strong><?= e($announcement['department'] ?? '—') ?></strong></div>
        <div><span class="eyebrow">Vacancies</span><strong><?= e($announcement['vacancyCount'] ?? '—') ?></strong></div><div><span class="eyebrow">Employment type</span><strong><?= e($announcement['employmentType'] ?? '—') ?></strong></div>
        <div><span class="eyebrow">Duty station</span><strong><?= e($announcement['dutyStation'] ?? '—') ?></strong></div><div><span class="eyebrow">Application deadline</span><strong><?= e(ocg_format_date($deadline)) ?></strong></div>
      </div>
      <?php if (!empty($announcement['requiredQualifications'])): ?><h3>Required qualifications</h3><p style="white-space:pre-line"><?= e($announcement['requiredQualifications']) ?></p><?php endif; ?>
      <?php if (!empty($announcement['experienceRequirements'])): ?><h3>Experience requirements</h3><p style="white-space:pre-line"><?= e($announcement['experienceRequirements']) ?></p><?php endif; ?>
    <?php endif; ?>
    <?php if (!empty($announcement['tenderReference']) || !empty($announcement['scopeOfWork'])): ?>
      <h2>Tender information</h2><div class="stats-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:18px">
        <div><span class="eyebrow">Tender reference</span><strong><?= e($announcement['tenderReference'] ?? $announcement['reference'] ?? '—') ?></strong></div><div><span class="eyebrow">Procurement category</span><strong><?= e($announcement['procurementCategory'] ?? '—') ?></strong></div>
        <div><span class="eyebrow">Submission deadline</span><strong><?= e(ocg_format_date($deadline)) ?></strong></div><div><span class="eyebrow">Bid opening</span><strong><?= e($announcement['bidOpeningInformation'] ?? '—') ?></strong></div>
      </div>
      <?php foreach (['Scope of work'=>'scopeOfWork','Eligibility requirements'=>'eligibilityRequirements','Submission instructions'=>'submissionInstructions'] as $label => $key): if (empty($announcement[$key])) continue; ?><h3><?= e($label) ?></h3><p style="white-space:pre-line"><?= e($announcement[$key]) ?></p><?php endforeach; ?>
    <?php endif; ?>
    <?php if ($attachments): ?><h2>Downloadable documents</h2><div class="file-list"><?php foreach ($attachments as $attachment): $media = $attachment['mediaAsset'] ?? null; $url = ocg_media_url($media); if (!$url) continue; ?><a class="file-card" href="<?= e($url . (str_contains($url, '?') ? '&' : '?') . 'download=1') ?>" target="_blank" rel="noopener"><span><strong><?= e($media['originalName'] ?? 'Document') ?></strong><small><?= e(strtoupper($media['extension'] ?? 'FILE')) ?></small></span><b>↓</b></a><?php endforeach; ?></div><?php endif; ?>
  </article>
  <aside class="detail-sidebar"><div class="project-card-body"><span class="eyebrow">Notice summary</span><h2>At a glance</h2><div class="contact-list"><p><span>Category</span><strong><?= e(ocg_status_label($announcement['category'] ?? 'GENERAL_NOTICE')) ?></strong></p><p><span>State</span><strong><?= e(ocg_status_label($state)) ?></strong></p><p><span>Reference</span><strong><?= e($announcement['reference'] ?? '—') ?></strong></p><p><span>Deadline</span><strong><?= e(ocg_format_date($deadline, true)) ?></strong></p><p><span>Published</span><strong><?= e(ocg_format_date($announcement['publishedAt'] ?? null)) ?></strong></p></div><?php if (!empty($announcement['contactInformation'])): ?><p style="white-space:pre-line;margin-top:16px"><?= e($announcement['contactInformation']) ?></p><?php endif; ?><?php if (!empty($announcement['externalApplicationUrl'])): ?><a class="btn" style="margin-top:18px" href="<?= e($announcement['externalApplicationUrl']) ?>" target="_blank" rel="noopener">Apply / submit externally ↗</a><?php endif; ?></div></aside>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>