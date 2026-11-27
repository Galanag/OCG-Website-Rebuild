<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'About OCG';
$pageDescription = 'Learn about Oro-Construction Group: company profile, vision, mission, values, board of directors, executive management, CEO message and geographic coverage.';
$heroTitle = 'About Oro-Construction Group'; $heroEyebrow = 'Who we are'; $heroText = 'Building a Shining Future under the Oromia Sovereign Fund, with five specialized subsidiaries delivering construction, engineering, infrastructure, real estate and hospitality across East Africa.'; $heroImage = '12/6.1-8.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$board = ocg_corporate_metadata('about', 'board');
$executives = ocg_corporate_metadata('about', 'executives');
$values = ocg_corporate_metadata('about', 'values')['values'] ?? [];
$geo = ocg_corporate_metadata('about', 'geographic-coverage');
?>
<main id="main-content">
<?= ocg_page_nav(['company-overview'=>'Overview','vision'=>'Vision','mission'=>'Mission','values'=>'Values','board'=>'Board','executives'=>'Executive Management','ceo-message'=>'CEO Message','geographic-coverage'=>'Geographic Coverage']) ?>

<section class="section" id="company-overview"><div class="container split-grid">
  <div class="split-copy">
    <span class="eyebrow">Company profile</span>
    <h2>Enhancing Ethiopia’s infrastructure and urban landscape.</h2>
    <?= ocg_kses_post(ocg_page_section('about','company-overview',['content'=>''])['content'] ?? '') ?>
    <div class="financial-grid" style="margin-top:24px">
      <div class="financial-card"><span>Subsidiaries</span><strong>5</strong></div>
      <div class="financial-card"><span>Workforce</span><strong>5,200+</strong></div>
      <div class="financial-card historical"><span>2018 Revenue</span><strong>31.9B+ ETB</strong></div>
      <div class="financial-card target"><span>2019 Target</span><strong>39.32B ETB</strong></div>
    </div>
  </div>
  <div class="split-media"><img src="<?= e(image_url('12/photo_2025-12-17_14-55-02-1024x768.webp')) ?>" alt="OCG urban development project" loading="lazy"><div class="media-badge"><strong>Under OSF</strong><span>Oromia Sovereign Fund · For Generations</span></div></div>
</div></section>

<section class="section section-muted" id="vision"><div class="container mission-grid">
  <article class="mission-card"><span class="eyebrow">Our vision</span><h2>East Africa’s premier green infrastructure and development group.</h2><?= ocg_kses_post(ocg_page_section('about','vision',['content'=>''])['content'] ?? '') ?></article>
  <article class="mission-card" id="mission"><span class="eyebrow">Our mission</span><h2>Affordable, accessible, green, value-driven solutions.</h2><?= ocg_kses_post(ocg_page_section('about','mission',['content'=>''])['content'] ?? '') ?></article>
</div></section>

<section class="section" id="values"><div class="container"><div class="section-heading"><div><span class="eyebrow">Our values</span><h2>Ten values guiding every project.</h2><p>OCG’s core values shape how we plan, build and partner across every subsidiary and project.</p></div></div><div class="values-list"><?php foreach ($values as $i => $value): ?><article class="value-light"><span class="eyebrow"><?= e(str_pad((string)($i+1),2,'0',STR_PAD_LEFT)) ?></span><strong><?= e($value) ?></strong></article><?php endforeach; ?></div></div></section>

<section class="section section-muted" id="board"><div class="container"><div class="section-heading"><div><span class="eyebrow">Governance</span><h2>Board of Directors</h2><p><?= e($board['reportingPeriod'] ?? 'Reported profile; appointment dates require confirmation.') ?></p></div></div><div class="leadership-grid"><?php foreach (($board['members'] ?? []) as $m): $parts = preg_split('/\s+/', (string)($m['name'] ?? '')) ?: []; $initials = implode('', array_map(fn($p)=>mb_substr($p,0,1), array_slice($parts,0,2))); ?><article class="leader-card"><div class="leader-initial"><?= e($initials) ?></div><div><h3><?= e($m['name'] ?? '') ?></h3><p><?= e($m['role'] ?? '') ?></p></div></article><?php endforeach; ?></div></div></section>

<section class="section" id="executives"><div class="container"><div class="section-heading"><div><span class="eyebrow">Executive leadership</span><h2>Group executive management</h2><p><?= e($executives['reportingPeriod'] ?? 'Reported profile; appointment dates require confirmation.') ?></p></div></div><div class="leadership-grid"><?php foreach (($executives['executives'] ?? []) as $m): $parts = preg_split('/\s+/', (string)($m['name'] ?? '')) ?: []; $initials = implode('', array_map(fn($p)=>mb_substr($p,0,1), array_slice($parts,0,2))); ?><article class="leader-card"><div class="leader-initial"><?= e($initials) ?></div><div><h3><?= e($m['name'] ?? '') ?></h3><p><?= e($m['role'] ?? '') ?></p></div></article><?php endforeach; ?></div><?php if (!empty($executives['functions'])): ?><div class="chip-list" style="margin-top:20px"><?php foreach ($executives['functions'] as $f): ?><span class="chip"><?= e($f) ?></span><?php endforeach; ?></div><?php endif; ?></div></section>

<section class="section section-dark" id="ceo-message"><div class="container"><div class="section-heading"><div><span class="eyebrow eyebrow-light">CEO Message</span><h2>Record 2018 &amp; Ambitious 2019 Plan</h2><p>Historical reporting-period message. Figures are retained with their reporting period.</p></div></div><div class="article-body" style="max-width:900px;color:#dce8df"><?= ocg_kses_post(ocg_page_section('about','ceo-message',['content'=>''])['content'] ?? '') ?></div></div></section>

<section class="section" id="geographic-coverage"><div class="container"><div class="section-heading"><div><span class="eyebrow">Nationwide footprint</span><h2>Geographic coverage and active backlog.</h2><p>From Finfinne (Addis Ababa) to remote districts, OCG executes federal and regional projects across Ethiopia.</p></div></div>
  <div class="split-grid">
    <div>
      <?= ocg_kses_post(ocg_page_section('about','geographic-coverage',['content'=>''])['content'] ?? '') ?>
      <div class="chip-list" style="margin-top:18px"><?php foreach (($geo['regions'] ?? []) as $r): ?><span class="chip"><?= e($r) ?></span><?php endforeach; ?></div>
    </div>
    <div>
      <div class="financial-grid" style="grid-template-columns:1fr 1fr">
        <div class="financial-card"><span>Total active backlog</span><strong>77.7B ETB</strong></div>
        <?php foreach (($geo['backlogDistribution'] ?? []) as $b): ?><div class="financial-card"><span><?= e($b['name'] ?? '') ?> backlog</span><strong><?= e($b['etb'] ?? '') ?>B ETB</strong></div><?php endforeach; ?>
      </div>
      <p class="notice-legal" style="margin-top:12px">Backlog figures are reported as provided in the source profile.</p>
    </div>
  </div>
</div></section>

<section class="section section-muted"><div class="container"><div class="cta-band"><div><span class="eyebrow eyebrow-light">Our subsidiaries</span><h2>Five specialist subsidiaries. One group.</h2><p>Explore the mandates, historical performance and strategic targets of each OCG subsidiary.</p></div><div class="cta-band-actions"><a class="btn btn-light" href="subsidiaries.php">View subsidiaries <span aria-hidden="true">→</span></a></div></div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
