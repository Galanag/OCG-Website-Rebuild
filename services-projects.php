<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Services & Projects'; $pageDescription = 'Discover OCG service areas, selected project updates and the integrated OCG delivery approach.';
$heroTitle = 'Services & Projects'; $heroEyebrow = 'What we deliver'; $heroText = 'Integrated construction, infrastructure, engineering and development solutions designed around quality, efficiency and community value.'; $heroImage = '12/walmal-1024x576.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$publicProjectData = ocg_api_content('projects', ['limit' => 6, 'sort' => '-publishedAt']);
$projects = $publicProjectData['items'] ?? $projects;
?>
<main id="main-content">
<?= ocg_page_nav(['service-lines'=>'Service Lines','services'=>'Capabilities','projects'=>'Projects','operational-capacity'=>'Capacity','equipment'=>'Equipment','properties'=>'Properties','quality'=>'Quality & Safety','clients'=>'Clients','why-choose'=>'Why OCG','csr'=>'CSR']) ?>
<?= ocg_page_nav(['services' => 'Services', 'projects' => 'Project updates', 'why-choose-us' => 'Why OCG']) ?>
<section class="section" id="services"><div class="container"><div class="section-heading"><div><span class="eyebrow">Our services</span><h2>Capabilities across the built environment.</h2><p>OCG’s integrated group structure brings together capabilities delivered through its specialist subsidiaries.</p></div></div><div class="cards-grid"><?php foreach ($services as $service): ?><article class="service-card"><div class="service-image"><img src="<?= e(image_url($service['image'])) ?>" alt="<?= e($service['title']) ?>" loading="lazy"><span class="service-no"><?= e($service['number']) ?></span></div><div class="service-body"><h3><?= e($service['title']) ?></h3><p><?= e($service['text']) ?></p><a class="text-link" href="partner.php">Discuss a project <span aria-hidden="true">→</span></a></div></article><?php endforeach; ?></div></div></section>
<?= ocg_corporate_section('services', 'service-lines', 'Specialized service lines') ?>
<?= ocg_corporate_section('services', 'operational-capacity', 'Operational capacity') ?>
<?= ocg_corporate_section('services', 'equipment', 'Equipment and machinery') ?>
<?= ocg_corporate_section('services', 'properties', 'Real properties') ?>
<?= ocg_corporate_section('services', 'operational-excellence', 'Operational excellence') ?>
<?= ocg_corporate_section('services', 'quality', 'Quality, health, safety and environment') ?>
<?= ocg_corporate_section('services', 'clients', 'Clients and partners') ?>
<?= ocg_corporate_section('services', 'why-choose', 'Why choose OCG') ?>
<?= ocg_corporate_section('services', 'csr', 'Corporate social responsibility') ?>
<section class="section section-muted" id="projects"><div class="container"><div class="section-heading"><div><span class="eyebrow">Project updates</span><h2>Selected work and public updates.</h2><p>These items are based on articles listed on OCG’s current website. Project status details should be verified with the relevant project team before use in external communications.</p></div><a class="text-link" href="news.php">All news &amp; updates <span aria-hidden="true">→</span></a></div><?= ocg_project_grid($projects, 6) ?></div></section>
<section class="section" id="why-choose-us"><div class="container"><div class="section-heading"><div><span class="eyebrow">Why OCG</span><h2>An integrated approach to complex work.</h2><p>OCG’s existing website highlights the value of working across specialist subsidiaries and keeping a shared focus on project outcomes.</p></div></div><div class="value-grid" style="background:var(--green);padding:16px;border-radius:16px"><article class="value-card"><div class="value-icon">⌘</div><h3>Integrated delivery</h3><p>Construction, engineering and development expertise connected within one group.</p></article><article class="value-card"><div class="value-icon">◷</div><h3>Reliable completion</h3><p>Planning and delivery practices focused on quality and agreed project schedules.</p></article><article class="value-card"><div class="value-icon">◇</div><h3>Value for money</h3><p>Coordinated resources and specialist capability to support cost-effective delivery.</p></article><article class="value-card"><div class="value-icon">♧</div><h3>Community focus</h3><p>Infrastructure and development intended to strengthen local communities over time.</p></article></div><div style="margin-top:30px"><a class="btn" href="projects.php">Explore the project register <span aria-hidden="true">→</span></a></div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>