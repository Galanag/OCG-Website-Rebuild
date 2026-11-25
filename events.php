<?php
$pageTitle = 'Events'; $pageDescription = 'Upcoming and past OCG project milestones, visits and corporate events.'; $heroTitle = 'Events'; $heroEyebrow = 'What’s happening'; $heroText = 'Project visits, infrastructure milestones and OCG events, with dates and locations.'; $heroImage = '12/gololicha-2-1024x682.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$upcomingData = ocg_api_content('events', ['limit'=>12,'timeframe'=>'upcoming','sort'=>'startsAt']);
$pastData = ocg_api_content('events', ['limit'=>12,'timeframe'=>'past','sort'=>'-startsAt']);
$upcoming = $upcomingData['items'] ?? [];
$past = $pastData['items'] ?? [];
?>
<main id="main-content">
<section class="section"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Event calendar</span><h2>Upcoming and recent events</h2><p>Events are published from the CMS and separated by their scheduled date.</p></div></div>
  <?php if ($upcoming): ?><h2>Upcoming</h2><div class="news-grid" style="margin-bottom:34px"><?php foreach ($upcoming as $event) { echo ocg_event_card($event); } ?></div><?php endif; ?>
  <?php if ($past): ?><h2>Past events</h2><div class="news-grid"><?php foreach ($past as $event) { echo ocg_event_card($event); } ?></div><?php endif; ?>
  <?php if (!$upcoming && !$past && !$upcomingData && !$pastData): ?>
    <div class="notice-grid">
      <?php $events = [
        ['title'=>'Inauguration of Gololcha Irrigation','desc'=>'The existing OCG events page notes that the Gololcha irrigation project was inaugurated after project works were completed.','date'=>'20 Dec 2025'],
        ['title'=>'Project and infrastructure visits','desc'=>'Photo updates record visits to infrastructure and urban development work across OCG’s project environment.','date'=>'18 Dec 2025'],
      ]; foreach ($events as $event): ?><article class="news-card"><div class="news-card-head"><span>OCG event</span><span><?= e($event['date']) ?></span></div><h3><?= e($event['title']) ?></h3><p><?= e($event['desc']) ?></p><a class="text-link" href="photo.php">View project gallery <span aria-hidden="true">→</span></a></article><?php endforeach; ?>
    </div><p class="notice-legal">The live CMS is temporarily unavailable; the original event summaries are shown above.</p>
  <?php elseif (!$upcoming && !$past): ?><div class="empty-state"><h2>No published events</h2><p>Upcoming and past events will appear here after publication.</p></div><?php endif; ?>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>