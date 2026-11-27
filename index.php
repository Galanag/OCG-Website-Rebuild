<?php
require_once __DIR__ . '/includes/data.php';

$featuredData = ocg_api_content('projects', ['limit' => 6, 'featured' => 'true', 'sort' => '-publishedAt']);
$latestData = ocg_api_content('projects', ['limit' => 6, 'sort' => '-publishedAt']);
$latestProjects = $latestData['items'] ?? $projects;
$featuredProjects = !empty($featuredData['items']) ? $featuredData['items'] : $latestProjects;
$latestAnnouncements = ocg_api_content('announcements', ['limit' => 3, 'sort' => '-publishedAt'])['items'] ?? [];
$latestNews = ocg_api_content('news', ['limit' => 3, 'sort' => '-publishedAt'])['items'] ?? [];
$upcomingEvents = ocg_api_content('events', ['limit' => 3, 'timeframe' => 'upcoming', 'sort' => 'startsAt'])['items'] ?? [];
$galleryProjects = ocg_api_content('projects', ['limit' => 4, 'sort' => '-publishedAt'])['items'] ?? [];
$galleryItems = [];
foreach ($galleryProjects as $galleryProject) {
    foreach (($galleryProject['images'] ?? []) as $galleryImage) {
        $url = ocg_media_url($galleryImage['mediaAsset'] ?? null);
        if ($url) $galleryItems[] = ['url' => $url, 'alt' => $galleryImage['altText'] ?? $galleryProject['title'] ?? 'OCG project'];
        if (count($galleryItems) >= 4) break 2;
    }
}
$publicStats = ocg_public_stats();
$strategy = ocg_corporate_metadata('home', 'strategy')['pillars'] ?? [];
$homeStats = ocg_corporate_metadata('home', 'statistics');
$pageTitle = 'Home';
$pageDescription = 'Oro-Construction Group (OCG) unites five specialized subsidiaries under the Oromia Sovereign Fund to deliver construction, engineering, infrastructure, real estate and hospitality across East Africa.';
require __DIR__ . '/includes/header.php';
?>
<main id="main-content">
  <section class="hero">
    <div class="container hero-content">
      <span class="hero-kicker">Oromia Sovereign Fund (OSF) · For Generations | Dhalootaaf</span>
      <h1>Building a <em>Shining Future.</em></h1>
      <p>Oro-Construction Group unites five specialized subsidiaries to deliver world-class infrastructure, sustainable methodologies, and innovative urban development across East Africa.</p>
      <div class="hero-actions">
        <a class="btn btn-light" href="about.php">About OCG <span aria-hidden="true">→</span></a>
        <a class="btn" style="background:transparent;border-color:rgba(255,255,255,.58)" href="projects.php">Explore projects <span aria-hidden="true">↗</span></a>
        <a class="hero-cta-note" href="contact.php">Contact OCG <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <div class="hero-bottom"><div class="container hero-bottom-inner"><div><strong>5 Specialized Subsidiaries · 5,200+ Workforce · 77.7B ETB Active Backlog</strong><br><small>Construction · Engineering · Infrastructure · Real Estate · Hospitality</small></div><a class="hero-scroll" href="#home-overview">Scroll to explore <span aria-hidden="true">↓</span></a></div></div>
  </section>

  <section class="stats-band" aria-label="OCG at a glance"><div class="container stats-grid">
    <div class="stat"><div class="stat-number">5</div><div class="stat-label">Specialized subsidiaries</div><div class="stat-note">One cohesive vision</div></div>
    <div class="stat"><div class="stat-number">5,200+</div><div class="stat-label">Skilled workforce</div><div class="stat-note">Across 5 subsidiaries</div></div>
    <div class="stat"><div class="stat-number">31.9B+</div><div class="stat-label">ETB 2018 revenue</div><div class="stat-note">Historical actual, +40.5% YoY</div></div>
    <div class="stat"><div class="stat-number">39.32B</div><div class="stat-label">ETB 2019 revenue target</div><div class="stat-note">7.07B ETB gross profit goal</div></div>
  </div></section>

  <section class="section" id="home-overview"><div class="container split-grid">
    <div class="split-copy">
      <span class="eyebrow">Who we are</span>
      <h2>A prominent construction and development group in Ethiopia.</h2>
      <?= ocg_kses_post(ocg_page_section('home', 'overview', ['content' => '<p>OCG unites five specialized subsidiaries under the Oromia Sovereign Fund to deliver construction, engineering, infrastructure, real estate and hospitality solutions.</p>'])['content'] ?? '') ?>
      <ul class="check-list">
        <li>Integrated ecosystem: internal materials, design and heavy machinery</li>
        <li>Global standards: IFRS compliant; ISO-certified operations as reported</li>
        <li>Capital strength: 15B ETB authorized capital (6.8B ETB paid-up)</li>
      </ul>
      <a class="btn" href="about.php">Learn about OCG <span aria-hidden="true">→</span></a>
    </div>
    <div class="split-media">
      <img src="<?= e(image_url('12/walmal-1024x576.webp')) ?>" alt="OCG infrastructure project" loading="lazy">
      <div class="media-badge"><strong>77.7B ETB</strong><span>Active project backlog across federal &amp; regional works</span></div>
    </div>
  </div></section>

  <section class="section section-muted"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">What we do</span><h2>Expertise that moves development forward.</h2><p>OCG’s services span the built environment—from buildings and civil works to engineering, water infrastructure, real estate and tourism development.</p></div><a class="text-link" href="services-projects.php">All services <span aria-hidden="true">→</span></a></div>
    <div class="cards-grid">
    <?php foreach (array_slice($services, 0, 6) as $service): ?>
      <article class="service-card"><div class="service-image"><img src="<?= e(image_url($service['image'])) ?>" alt="<?= e($service['title']) ?>" loading="lazy"><span class="service-no"><?= e($service['number']) ?></span></div><div class="service-body"><h3><?= e($service['title']) ?></h3><p><?= e($service['text']) ?></p><a class="text-link" href="services-projects.php#service-lines">Explore service <span aria-hidden="true">→</span></a></div></article>
    <?php endforeach; ?>
    </div>
  </div></section>

  <section class="section"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">Selected work</span><h2>Projects with a purpose.</h2><p>Published project records from the OCG project register.</p></div><a class="text-link" href="projects.php">View project register <span aria-hidden="true">→</span></a></div>
    <?php if ($publicStats): ?><div class="stats-grid" style="margin-bottom:22px"><div class="stat-card"><span class="eyebrow">Portfolio</span><strong><?= e($publicStats['projects']['total'] ?? 0) ?></strong><span class="notice-legal">published projects</span></div><div class="stat-card"><span class="eyebrow">Delivery</span><strong><?= e($publicStats['projects']['ongoing'] ?? 0) ?></strong><span class="notice-legal">ongoing projects</span></div><div class="stat-card"><span class="eyebrow">Completed</span><strong><?= e($publicStats['projects']['completed'] ?? 0) ?></strong><span class="notice-legal">completed projects</span></div><div class="stat-card"><span class="eyebrow">Notices</span><strong><?= e($publicStats['announcements']['published'] ?? 0) ?></strong><span class="notice-legal">published notices</span></div></div><?php endif; ?>
    <?= ocg_project_grid($featuredProjects, 4) ?>
  </div></section>

  <section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow eyebrow-light">The OCG difference</span><h2>Built on commitment.</h2><p>Technical capability, integrated delivery, and a clear focus on responsible outcomes.</p></div><a class="text-link" style="color:#fff" href="about.php#values">Our values <span aria-hidden="true">→</span></a></div>
    <div class="value-grid">
      <article class="value-card"><div class="value-icon">✳</div><h3>Integrated delivery</h3><p>Internal sourcing of materials, design and heavy machinery eliminates bottlenecks and reduces costs.</p></article>
      <article class="value-card"><div class="value-icon">◷</div><h3>Quality &amp; reliability</h3><p>IFRS-aligned practice, ISO-certified systems and rigorous project controls support dependable outcomes.</p></article>
      <article class="value-card"><div class="value-icon">⌂</div><h3>Community impact</h3><p>Projects strengthen communities, support mobility, housing, water access and economic development.</p></article>
      <article class="value-card"><div class="value-icon">♻</div><h3>Sustainable practice</h3><p>Green stewardship, renewable energy, ESG compliance and responsible resource use guide long-term value.</p></article>
    </div>
  </div></section>

  <section class="section" id="strategy"><div class="container"><div class="section-heading"><div><span class="eyebrow">Strategic direction</span><h2>Six pillars for the road ahead.</h2><p>Current capabilities and future ambitions are presented separately. Proposed certifications or green projects are not represented as completed.</p></div><a class="text-link" href="about.php#ceo-message">CEO message <span aria-hidden="true">→</span></a></div><div class="strategy-grid"><?php foreach ($strategy as $index => $pillar): ?><article class="strategy-card"><span class="strategy-number"><?= e(str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT)) ?></span><h3><?= e($pillar['title'] ?? '') ?></h3><div class="chip-list"><?php foreach (($pillar['items'] ?? []) as $item): ?><span class="chip"><?= e($item) ?></span><?php endforeach; ?></div></article><?php endforeach; ?></div></div></section>

  <section class="section section-muted"><div class="container"><div class="section-heading"><div><span class="eyebrow">Our family</span><h2>Five specialist subsidiaries. One shared ambition.</h2><p>OCG’s subsidiaries contribute distinct capabilities across contracting, engineering consultancy, construction, real estate and hospitality.</p></div><a class="text-link" href="subsidiaries.php">Meet the subsidiaries <span aria-hidden="true">→</span></a></div>
    <div class="subsidiary-grid">
      <?php foreach ($subsidiaries as $sub): ?><article class="subsidiary-card"><div class="subsidiary-mark"><?= e($sub['mark']) ?></div><div class="small-label"><?= e($sub['category']) ?></div><h3><?= e($sub['name']) ?></h3><p><?= e($sub['description']) ?></p><a class="text-link" href="<?= e($sub['url']) ?>" target="_blank" rel="noopener">Visit website <span aria-hidden="true">↗</span></a></article><?php endforeach; ?>
    </div>
  </div></section>

  <?php if ($latestNews || $latestAnnouncements || $upcomingEvents): ?>
  <section class="section"><div class="container">
    <?php if ($latestNews): ?><div class="section-heading"><div><span class="eyebrow">Newsroom</span><h2>Latest news.</h2><p>Published stories and project milestones from OCG.</p></div><a class="text-link" href="news.php">All news <span aria-hidden="true">→</span></a></div><div class="news-grid"><?php foreach ($latestNews as $article) { echo ocg_news_card($article); } ?></div><?php endif; ?>
    <?php if ($latestAnnouncements): ?><div class="section-heading" style="margin-top:34px"><div><span class="eyebrow">Corporate notices</span><h2>Latest announcements.</h2><p>Vacancies, tenders, procurement notices and general announcements.</p></div><a class="text-link" href="announcements.php">All announcements <span aria-hidden="true">→</span></a></div><div class="notice-grid"><?php foreach ($latestAnnouncements as $announcement) { echo ocg_announcement_card($announcement); } ?></div><?php endif; ?>
    <?php if ($upcomingEvents): ?><div class="section-heading" style="margin-top:34px"><div><span class="eyebrow">Events</span><h2>Upcoming events.</h2><p>Project visits, milestones and corporate events.</p></div><a class="text-link" href="events.php">All events <span aria-hidden="true">→</span></a></div><div class="news-grid"><?php foreach ($upcomingEvents as $event) { echo ocg_event_card($event); } ?></div><?php endif; ?>
  </div></section>
  <?php endif; ?>

  <section class="section section-muted"><div class="container"><div class="cta-band"><div><span class="eyebrow eyebrow-light">Work with OCG</span><h2>Have a project or partnership in mind?</h2><p>Connect with OCG to discuss potential collaboration, project enquiries or supplier and contractor partnerships.</p></div><div class="cta-band-actions"><a class="btn btn-light" href="partner.php">Partner with us <span aria-hidden="true">↗</span></a><a class="btn" href="contact.php" style="background:transparent;border-color:rgba(255,255,255,.5)">Contact OCG</a></div></div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
