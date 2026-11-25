<?php
require_once __DIR__ . '/includes/data.php';
$slug = isset($_GET['slug']) ? substr(trim((string)$_GET['slug']), 0, 240) : '';
$event = $slug ? ocg_api_item('events', $slug) : null;
$pageTitle = $event['title'] ?? 'Event not found';
$pageDescription = $event ? ocg_excerpt($event['description'] ?? '', 180) : 'The requested event is not available.';
require __DIR__ . '/includes/header.php';
if (!$event) {
    http_response_code(404);
    echo '<main id="main-content"><section class="section"><div class="container empty-state"><h1>Event not found</h1><p>This event may be unpublished or the address may be incorrect.</p><a class="btn" href="events.php">Browse events</a></div></section></main>';
    require __DIR__ . '/includes/footer.php'; exit;
}
$image = ocg_media_url($event['eventImage'] ?? null);
?>
<main id="main-content">
<?php if ($image): ?><section class="hero hero-inner-page" style="min-height:380px;background-image:linear-gradient(90deg,rgba(8,35,25,.92),rgba(18,59,43,.62)),url('<?= e($image) ?>')"><div class="hero-inner container"><div class="hero-copy"><span class="eyebrow eyebrow-light"><?= e($event['category'] ?? 'Event') ?></span><h1><?= e($event['title']) ?></h1><p><?= e(ocg_excerpt($event['description'] ?? '', 180)) ?></p></div></div></section><?php endif; ?>
<section class="section"><div class="container detail-layout">
  <article class="article-body"><span class="eyebrow"><?= e(ocg_status_label($event['status'] ?? 'UPCOMING')) ?></span><h2>About this event</h2><?= ocg_kses_post($event['description'] ?? '') ?>
    <?php if (!empty($event['registrationUrl'])): ?><a class="btn" style="margin-top:18px" href="<?= e($event['registrationUrl']) ?>" target="_blank" rel="noopener">Register / learn more ↗</a><?php endif; ?>
  </article>
  <aside class="detail-sidebar"><div class="project-card-body"><span class="eyebrow">Event details</span><h2>At a glance</h2><div class="contact-list"><p><span>Starts</span><strong><?= e(ocg_format_date($event['startsAt'] ?? null, true)) ?></strong></p><p><span>Ends</span><strong><?= e(ocg_format_date($event['endsAt'] ?? null, true)) ?></strong></p><p><span>Location</span><strong><?= e($event['location'] ?? 'Online') ?></strong></p><p><span>Organizer</span><strong><?= e($event['organizer'] ?? 'OCG') ?></strong></p><p><span>Status</span><strong><?= e(ocg_status_label($event['status'] ?? 'UPCOMING')) ?></strong></p></div><?php if (!empty($event['onlineMeetingUrl'])): ?><a class="btn btn-outline" style="margin-top:16px" href="<?= e($event['onlineMeetingUrl']) ?>" target="_blank" rel="noopener">Join online ↗</a><?php endif; ?><?php if (!empty($event['contactInfo'])): ?><p style="margin-top:16px;white-space:pre-line"><?= e($event['contactInfo']) ?></p><?php endif; ?></div></aside>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>