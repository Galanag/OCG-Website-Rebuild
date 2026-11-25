<?php
require_once __DIR__ . '/includes/data.php';

$featuredData = ocg_api_content('projects', ['limit' => 6, 'featured' => 'true', 'sort' => '-publishedAt']);
$latestData = ocg_api_content('projects', ['limit' => 6, 'sort' => '-publishedAt']);
$latestProjects = $latestData['items'] ?? $projects;
$featuredProjects = !empty($featuredData['items']) ? $featuredData['items'] : $latestProjects;
$latestAnnouncements = ocg_api_content('announcements', ['limit' => 3, 'sort' => '-publishedAt'])['items'] ?? [];
$openVacancies = ocg_api_content('announcements', ['limit' => 2, 'kind' => 'vacancy', 'state' => 'OPEN', 'sort' => 'deadline'])['items'] ?? [];
$openTenders = ocg_api_content('announcements', ['limit' => 2, 'kind' => 'tender', 'state' => 'OPEN', 'sort' => 'deadline'])['items'] ?? [];
$latestNews = ocg_api_content('news', ['limit' => 3, 'sort' => '-publishedAt'])['items'] ?? [];
$upcomingEvents = ocg_api_content('events', ['limit' => 3, 'timeframe' => 'upcoming', 'sort' => 'startsAt'])['items'] ?? [];
$galleryProjects = ocg_api_content('projects', ['limit' => 4, 'sort' => '-publishedAt'])['items'] ?? [];
$galleryItems = [];
foreach ($galleryProjects as $galleryProject) {
    foreach (($galleryProject['images'] ?? []) as $galleryImage) {
        $url = ocg_media_url($galleryImage['mediaAsset'] ?? null);
        if ($url) {
            $galleryItems[] = ['url' => $url, 'alt' => $galleryImage['altText'] ?? $galleryProject['title'] ?? 'OCG project'];
        }
        if (count($galleryItems) >= 4) break 2;
    }
}
$publicStats = ocg_public_stats();
$pageTitle = 'Home';
$pageDescription = 'Oro-Construction Group brings together construction, engineering, infrastructure and real estate development expertise to build stronger communities across Ethiopia.';
require __DIR__ . '/includes/header.php';
?>
<main id="main-content">
  <section class="hero">
    <div class="container hero-content">
      <span class="hero-kicker">Oro-Construction Group · Oromia Sovereign Fund</span>
      <h1>Building a <em>Shining Future.</em></h1>
      <p>Five specialized subsidiaries delivering construction, engineering, infrastructure, real estate, tourism and hospitality with a shared commitment to quality and sustainable development.</p>
      <div class="hero-actions"><a class="btn btn-light" href="about.php">About OCG <span aria-hidden="true">→</span></a><a class="btn" style="background:transparent;border-color:rgba(255,255,255,.58)" href="projects.php">Explore projects <span aria-hidden="true">↗</span></a><a class="hero-cta-note" href="contact.php">Contact <span aria-hidden="true">→</span></a></div>
    </div>
    <div class="hero-bottom"><div class="container hero-bottom-inner"><div><strong>Building with purpose. Delivering with integrity.</strong><br><small>Construction · Engineering · Infrastructure · Development</small></div><a class="hero-scroll" href="#about-intro">Scroll to explore <span aria-hidden="true">↓</span></a></div></div>
  </section>
  <section class="stats-band" aria-label="OCG at a glance"><div class="container stats-grid">
    <div class="stat"><div class="stat-number">5</div><div class="stat-label">Specialized subsidiaries</div><div class="stat-note">One connected group</div></div>
    <div class="stat"><div class="stat-number">5,200+</div><div class="stat-label">Reported workforce</div><div class="stat-note">Across the subsidiaries</div></div>
    <div class="stat"><div class="stat-number">77.7B</div><div class="stat-label">ETB reported backlog</div><div class="stat-note">Active project backlog</div></div>
    <div class="stat"><div class="stat-number">39.32B</div><div class="stat-label">ETB FY 2026/2027 target</div><div class="stat-note">Consolidated revenue target</div></div>
  </div></section>
  <?= ocg_corporate_section('home', 'overview', 'A connected construction and development group', '<p>OCG brings together construction, engineering, infrastructure, real estate, tourism and hospitality capabilities under the Oromia Sovereign Fund.</p>') ?>
  <section class="section section-muted"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">What we do</span><h2>Expertise that moves development forward.</h2><p>OCG’s services span the built environment—from public and commercial buildings to civil works, engineering, water infrastructure and tourism development.</p></div><a class="text-link" href="services-projects.php">All services &amp; projects <span aria-hidden="true">→</span></a></div>
    <div class="cards-grid">
    <?php foreach ($services as $service): ?>
      <article class="service-card"><div class="service-image"><img src="<?= e(image_url($service['image'])) ?>" alt="<?= e($service['title']) ?>" loading="lazy"><span class="service-no"><?= e($service['number']) ?></span></div><div class="service-body"><h3><?= e($service['title']) ?></h3><p><?= e($service['text']) ?></p><a class="text-link" href="services-projects.php#services">Explore service <span aria-hidden="true">→</span></a></div></article>
    <?php endforeach; ?>
    </div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">Selected work</span><h2>Projects with a purpose.</h2><p>Database-managed project updates, status and delivery progress.</p></div><a class="text-link" href="projects.php">View project register <span aria-hidden="true">→</span></a></div>
    <?php if ($publicStats): ?><div class="stats-grid" style="margin-bottom:22px"><div class="stat-card"><span class="eyebrow">Portfolio</span><strong><?= e($publicStats['projects']['total'] ?? 0) ?></strong><span class="notice-legal">published projects</span></div><div class="stat-card"><span class="eyebrow">Delivery</span><strong><?= e($publicStats['projects']['ongoing'] ?? 0) ?></strong><span class="notice-legal">ongoing projects</span></div><div class="stat-card"><span class="eyebrow">Completed</span><strong><?= e($publicStats['projects']['completed'] ?? 0) ?></strong><span class="notice-legal">completed projects</span></div><div class="stat-card"><span class="eyebrow">Notices</span><strong><?= e($publicStats['announcements']['published'] ?? 0) ?></strong><span class="notice-legal">published notices</span></div></div><?php endif; ?>
    <?= ocg_project_grid($featuredProjects, 4) ?>
    <div style="margin-top:18px"><a class="text-link" href="projects.php">Explore all projects <span aria-hidden="true">→</span></a></div>
  </div></section>
  <section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow eyebrow-light">The OCG difference</span><h2>Built on commitment.</h2><p>Our approach brings technical capability together with a clear focus on responsible delivery and the people who benefit from it.</p></div><a class="text-link" style="color:#fff" href="about.php#values">Our values <span aria-hidden="true">→</span></a></div>
    <div class="value-grid">
      <article class="value-card"><div class="value-icon">✳</div><h3>Integrated delivery</h3><p>Complementary subsidiaries help connect studies, design, resources and construction.</p></article>
      <article class="value-card"><div class="value-icon">◷</div><h3>Quality &amp; reliability</h3><p>Structured planning and quality assurance support dependable project outcomes.</p></article>
      <article class="value-card"><div class="value-icon">⌂</div><h3>Community impact</h3><p>Projects are intended to strengthen communities and support local development.</p></article>
      <article class="value-card"><div class="value-icon">♻</div><h3>Sustainable practice</h3><p>Responsible resource use and environmental care guide long-term value.</p></article>
    </div>
  </div></section>
  <?php $strategy = ocg_corporate_metadata('home', 'strategy'); ?>
  <section class="section" id="strategy"><div class="container"><div class="section-heading"><div><span class="eyebrow">Strategic direction</span><h2>Six pillars for the road ahead.</h2><p>Current capabilities and future ambitions are presented separately. Proposed certifications or green projects are not represented as completed.</p></div><a class="text-link" href="about.php#strategy">Full strategy <span aria-hidden="true">→</span></a></div><div class="strategy-grid"><?php foreach (($strategy['pillars'] ?? []) as $index => $pillar): ?><article class="strategy-card"><span class="strategy-number"><?= e(str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT)) ?></span><h3><?= e($pillar['title'] ?? '') ?></h3><div class="chip-list"><?php foreach (($pillar['items'] ?? []) as $item): ?><span class="chip"><?= e($item) ?></span><?php endforeach; ?></div></article><?php endforeach; ?></div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Our family</span><h2>Five specialist subsidiaries. One shared ambition.</h2><p>OCG’s subsidiaries contribute distinct capabilities across contracting, engineering consultancy, construction, real estate and hospitality.</p></div><a class="text-link" href="subsidiaries.php">Meet the subsidiaries <span aria-hidden="true">→</span></a></div>
    <div class="subsidiary-grid">
      <?php foreach ($subsidiaries as $sub): ?><article class="subsidiary-card"><div class="subsidiary-mark"><?= e($sub['mark']) ?></div><div class="small-label"><?= e($sub['category']) ?></div><h3><?= e($sub['name']) ?></h3><p><?= e($sub['description']) ?></p><a class="text-link" href="<?= e($sub['url']) ?>" target="_blank" rel="noopener">Visit website <span aria-hidden="true">↗</span></a></article><?php endforeach; ?>
    </div>
  </div></section>
  <?php if ($latestAnnouncements || $latestNews || $upcomingEvents): ?>
  <section class="section"><div class="container">
    <?php if ($latestAnnouncements): ?><div class="section-heading"><div><span class="eyebrow">Corporate notices</span><h2>Latest announcements.</h2><p>Vacancies, tenders, procurement notices and general announcements.</p></div><a class="text-link" href="announcements.php">All announcements <span aria-hidden="true">→</span></a></div><div class="notice-grid"><?php foreach ($latestAnnouncements as $announcement) { echo ocg_announcement_card($announcement); } ?></div><?php endif; ?>
    <?php if ($openVacancies || $openTenders): ?><div class="section-heading" style="margin-top:34px"><div><span class="eyebrow">Business &amp; careers</span><h2>Open opportunities.</h2><p>Current vacancies and tender notices with published deadlines.</p></div><a class="text-link" href="vacancies.php">Vacancies <span aria-hidden="true">→</span></a><a class="text-link" style="margin-left:14px" href="tenders.php">Tenders <span aria-hidden="true">→</span></a></div><div class="notice-grid"><?php foreach (array_merge($openVacancies, $openTenders) as $announcement) { echo ocg_announcement_card($announcement); } ?></div><?php endif; ?>
    <?php if ($galleryItems): ?><div class="section-heading" style="margin-top:34px"><div><span class="eyebrow">From our projects</span><h2>Project gallery.</h2><p>Images attached to published project records.</p></div><a class="text-link" href="photo.php">Photo gallery <span aria-hidden="true">→</span></a></div><div class="gallery-grid"><?php foreach ($galleryItems as $galleryItem): ?><a class="gallery-item" href="<?= e($galleryItem['url']) ?>" target="_blank" rel="noopener"><img src="<?= e($galleryItem['url']) ?>" alt="<?= e($galleryItem['alt']) ?>" loading="lazy"></a><?php endforeach; ?></div><?php endif; ?>
    <?php if ($latestNews): ?><div class="section-heading" style="margin-top:34px"><div><span class="eyebrow">Newsroom</span><h2>Latest news.</h2><p>Published stories and project milestones from OCG.</p></div><a class="text-link" href="news.php">All news <span aria-hidden="true">→</span></a></div><div class="news-grid"><?php foreach ($latestNews as $article) { echo ocg_news_card($article); } ?></div><?php endif; ?>
    <?php if ($upcomingEvents): ?><div class="section-heading" style="margin-top:34px"><div><span class="eyebrow">Events</span><h2>Upcoming events.</h2><p>Project visits, milestones and corporate events.</p></div><a class="text-link" href="events.php">All events <span aria-hidden="true">→</span></a></div><div class="news-grid"><?php foreach ($upcomingEvents as $event) { echo ocg_event_card($event); } ?></div><?php endif; ?>
  </div></section>
  <?php endif; ?>
  <section class="section section-muted"><div class="container"><div class="cta-band"><div><span class="eyebrow eyebrow-light">Work with OCG</span><h2>Have a project or partnership in mind?</h2><p>Connect with OCG to discuss potential collaboration, project enquiries or supplier and contractor partnerships.</p></div><div class="cta-band-actions"><a class="btn btn-light" href="partner.php">Partner with us <span aria-hidden="true">↗</span></a><a class="btn" href="contact.php" style="background:transparent;border-color:rgba(255,255,255,.5)">Contact OCG</a></div></div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">FAQs</span><h2>Get to know OCG.</h2></div><a class="text-link" href="contact.php">Ask a question <span aria-hidden="true">→</span></a></div>
    <div class="faq-list">
      <details class="faq-item"><summary>Who is OCG accountable to?</summary><p>Oro-Construction Group is a public developmental enterprise under the Oromia Regional Government in Ethiopia. Its work is carried out with support from specialist subsidiaries.</p></details>
      <details class="faq-item"><summary>When was OCG established?</summary><p>The existing OCG website states that the group was officially established on September 21, 2021, under Oromia Regional Government Regulation No. 234/2022.</p></details>
      <details class="faq-item"><summary>What sectors does OCG serve?</summary><p>OCG covers building construction, infrastructure and civil works, engineering consultancy, water and environmental projects, real estate, hospitality and tourism development.</p></details>
      <details class="faq-item"><summary>How can I discuss a partnership?</summary><p>Use the Partner with Us form to introduce your organization, service or project, or contact OCG by email at <?= e(SITE_EMAIL) ?>.</p></details>
    </div>
  </div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
