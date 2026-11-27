<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Services & Projects'; $pageDescription = 'Explore OCG’s specialized service lines, operational capacity, quality standards, clients, project updates and why to partner with OCG.';
$heroTitle = 'Services & Projects'; $heroEyebrow = 'What we deliver'; $heroText = 'Integrated construction, infrastructure, engineering and development solutions designed around quality, efficiency and community value.'; $heroImage = '12/walmal-1024x576.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$publicProjectData = ocg_api_content('projects', ['limit' => 6, 'sort' => '-publishedAt']);
$projectsList = $publicProjectData['items'] ?? $projects;
$clients = ocg_corporate_metadata('services', 'clients');
$why = ocg_corporate_metadata('services', 'why-choose');
?>
<main id="main-content">
<?= ocg_page_nav(['service-lines'=>'Services','operational-capacity'=>'Capacity','equipment'=>'Equipment','properties'=>'Properties','quality'=>'Quality & ISO','clients'=>'Clients','projects'=>'Projects','why-choose'=>'Why OCG']) ?>

<section class="section" id="service-lines"><div class="container"><div class="section-heading"><div><span class="eyebrow">Specialized service lines</span><h2>Capabilities across the built environment.</h2><p>OCG’s integrated group structure brings together capabilities delivered through specialist subsidiaries.</p></div></div>
<div class="cards-grid"><?php foreach ($services as $service): ?><article class="service-card"><div class="service-image"><img src="<?= e(image_url($service['image'])) ?>" alt="<?= e($service['title']) ?>" loading="lazy"><span class="service-no"><?= e($service['number']) ?></span></div><div class="service-body"><h3><?= e($service['title']) ?></h3><p><?= e($service['text']) ?></p><a class="text-link" href="contact.php">Discuss a project <span aria-hidden="true">→</span></a></div></article><?php endforeach; ?></div>
</div></section>

<?= ocg_corporate_section('services', 'service-lines', 'Service portfolio details') ?>
<?= ocg_corporate_section('services', 'operational-capacity', 'Operational capacity') ?>
<?= ocg_corporate_section('services', 'equipment', 'Heavy Machinery Fleet') ?>
<?= ocg_corporate_section('services', 'properties', 'Strategic Real Properties') ?>
<?= ocg_corporate_section('services', 'quality', 'Global Standards & ISO') ?>

<section class="section section-muted" id="clients"><div class="container"><div class="section-heading"><div><span class="eyebrow">Clients and partners</span><h2>Key institutional clients &amp; partners.</h2><p>Names are reproduced as reported and do not imply endorsement.</p></div></div>
<div class="cards-grid"><?php foreach (($clients['groups'] ?? []) as $group): ?><article class="service-card" style="min-height:0"><div class="service-body"><h3><?= e($group['title'] ?? '') ?></h3><ul class="check-list"><?php foreach (($group['items'] ?? []) as $item): ?><li><?= e($item) ?></li><?php endforeach; ?></ul></div></article><?php endforeach; ?></div>
</div></section>

<section class="section" id="projects"><div class="container"><div class="section-heading"><div><span class="eyebrow">Project updates</span><h2>Selected work and public updates.</h2><p>Published project records from the OCG register. Verify status details with the relevant project team before external communications.</p></div><a class="text-link" href="projects.php">All projects <span aria-hidden="true">→</span></a></div><?= ocg_project_grid($projectsList, 6) ?></div></section>

<section class="section section-dark" id="why-choose"><div class="container"><div class="section-heading"><div><span class="eyebrow eyebrow-light">Why OCG</span><h2>Why partner with OCG.</h2><p>Proven delivery, turnkey integration, quality and safety, and social/environmental impact.</p></div></div>
<div class="value-grid"><?php foreach (($why['reasons'] ?? []) as $r): ?><article class="value-card"><div class="value-icon">✓</div><h3><?= e($r['title'] ?? '') ?></h3><p><?= e($r['text'] ?? '') ?></p></article><?php endforeach; ?></div>
<div style="margin-top:30px"><a class="btn btn-light" href="contact.php">Contact OCG <span aria-hidden="true">→</span></a></div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
