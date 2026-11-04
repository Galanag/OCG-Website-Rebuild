<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Home';
$pageDescription = 'Oro-Construction Group brings together construction, engineering, infrastructure and real estate development expertise to build stronger communities across Ethiopia.';
require __DIR__ . '/includes/header.php';
?>
<main id="main-content">
  <section class="hero">
    <div class="container hero-content">
      <span class="hero-kicker">Oro-Construction Group · Ethiopia</span>
      <h1>Building stronger communities. <em>Delivering lasting value.</em></h1>
      <p>Integrated construction, engineering and development expertise—working together to shape resilient infrastructure and sustainable communities across Ethiopia.</p>
      <div class="hero-actions"><a class="btn btn-light" href="services-projects.php">Explore our work <span aria-hidden="true">→</span></a><a class="btn" style="background:transparent;border-color:rgba(255,255,255,.58)" href="about.php">Discover OCG <span aria-hidden="true">↗</span></a></div>
    </div>
    <div class="hero-bottom"><div class="container hero-bottom-inner"><div><strong>Building with purpose. Delivering with integrity.</strong><br><small>Construction · Engineering · Infrastructure · Development</small></div><a class="hero-scroll" href="#about-intro">Scroll to explore <span aria-hidden="true">↓</span></a></div></div>
  </section>
  <section class="stats-band" aria-label="OCG at a glance"><div class="container stats-grid">
    <div class="stat"><div class="stat-number">5,200+</div><div class="stat-label">People across our group</div><div class="stat-note">Supporting work across sectors</div></div>
    <div class="stat"><div class="stat-number">500+</div><div class="stat-label">Projects annually</div><div class="stat-note">As reported on OCG’s website</div></div>
    <div class="stat"><div class="stat-number">$175M</div><div class="stat-label">Asset value</div><div class="stat-note">Approximate reported value</div></div>
    <div class="stat"><div class="stat-number">$138M</div><div class="stat-label">Annual turnover</div><div class="stat-note">Approximate reported value</div></div>
  </div></section>
  <section class="section" id="about-intro"><div class="container split-grid">
    <div class="split-copy"><span class="eyebrow">Who we are</span><h2>One group. Broad expertise. Shared purpose.</h2>
      <p>Oro-Construction Group (OCG) is a public developmental enterprise under the Oromia Regional Government, established to bring together complementary strengths in construction, engineering, infrastructure and real estate development.</p>
      <p>Through its subsidiaries, OCG supports complex projects from studies and design through construction, supervision and delivery—seeking dependable quality, efficient use of resources and lasting community value.</p>
      <ul class="check-list"><li>Integrated capability across multiple sectors</li><li>Local expertise supported by specialist subsidiaries</li><li>Commitment to quality, safety and sustainability</li></ul>
      <a class="text-link" href="about.php">Learn more about OCG <span aria-hidden="true">→</span></a>
    </div>
    <div class="split-media"><img src="<?= e(image_url('12/Walabu-Kegna.jpg')) ?>" alt="Industrial facility and construction workforce associated with OCG's construction sector" loading="lazy"><div class="media-badge"><strong>Since 2021</strong><span>Working to serve communities and support sustainable growth.</span></div></div>
  </div></section>
  <section class="section section-muted"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">What we do</span><h2>Expertise that moves development forward.</h2><p>OCG’s services span the built environment—from public and commercial buildings to civil works, engineering, water infrastructure and tourism development.</p></div><a class="text-link" href="services-projects.php">All services &amp; projects <span aria-hidden="true">→</span></a></div>
    <div class="cards-grid">
    <?php foreach ($services as $service): ?>
      <article class="service-card"><div class="service-image"><img src="<?= e(image_url($service['image'])) ?>" alt="<?= e($service['title']) ?>" loading="lazy"><span class="service-no"><?= e($service['number']) ?></span></div><div class="service-body"><h3><?= e($service['title']) ?></h3><p><?= e($service['text']) ?></p><a class="text-link" href="services-projects.php#services">Explore service <span aria-hidden="true">→</span></a></div></article>
    <?php endforeach; ?>
    </div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">Selected work</span><h2>Projects with a purpose.</h2><p>Discover selected project updates featured on OCG’s existing public website.</p></div><a class="text-link" href="news.php">View all updates <span aria-hidden="true">→</span></a></div>
    <div class="project-grid">
    <?php foreach ($projects as $project): ?>
      <article class="project-card"><a class="project-img" href="article.php?slug=<?= e($project['slug']) ?>" aria-label="Read <?= e($project['title']) ?>"><img src="<?= e(image_url($project['image'])) ?>" alt="<?= e($project['title']) ?>" loading="lazy"></a><div class="project-content"><div class="project-meta"><span class="pill"><?= e($project['category']) ?></span><span class="project-date"><?= e($project['date']) ?></span></div><h3><?= e($project['title']) ?></h3><p><?= e($project['excerpt']) ?></p><a class="text-link" href="article.php?slug=<?= e($project['slug']) ?>">Read project update <span aria-hidden="true">→</span></a></div></article>
    <?php endforeach; ?>
    </div>
  </div></section>
  <section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow eyebrow-light">The OCG difference</span><h2>Built on commitment.</h2><p>Our approach brings technical capability together with a clear focus on responsible delivery and the people who benefit from it.</p></div><a class="text-link" style="color:#fff" href="vision-mission.php">Our values <span aria-hidden="true">→</span></a></div>
    <div class="value-grid">
      <article class="value-card"><div class="value-icon">✳</div><h3>Integrated delivery</h3><p>Complementary subsidiaries help connect studies, design, resources and construction.</p></article>
      <article class="value-card"><div class="value-icon">◷</div><h3>Quality &amp; reliability</h3><p>Structured planning and quality assurance support dependable project outcomes.</p></article>
      <article class="value-card"><div class="value-icon">⌂</div><h3>Community impact</h3><p>Projects are intended to strengthen communities and support local development.</p></article>
      <article class="value-card"><div class="value-icon">♻</div><h3>Sustainable practice</h3><p>Responsible resource use and environmental care guide long-term value.</p></article>
    </div>
  </div></section>
  <section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Our family</span><h2>Five specialist subsidiaries. One shared ambition.</h2><p>OCG’s subsidiaries contribute distinct capabilities across contracting, engineering consultancy, construction, real estate and hospitality.</p></div><a class="text-link" href="subsidiaries.php">Meet the subsidiaries <span aria-hidden="true">→</span></a></div>
    <div class="subsidiary-grid">
      <?php foreach ($subsidiaries as $sub): ?><article class="subsidiary-card"><div class="subsidiary-mark"><?= e($sub['mark']) ?></div><div class="small-label"><?= e($sub['category']) ?></div><h3><?= e($sub['name']) ?></h3><p><?= e($sub['description']) ?></p><a class="text-link" href="<?= e($sub['url']) ?>" target="_blank" rel="noopener">Visit website <span aria-hidden="true">↗</span></a></article><?php endforeach; ?>
    </div>
  </div></section>
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
