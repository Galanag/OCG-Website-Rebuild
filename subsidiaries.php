<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Subsidiaries';
$pageDescription = 'Meet OCG’s five specialized subsidiaries: OCC, OBM, Walabu, ECO and IJA Developers, with mandates, historical performance and FY 2026/2027 targets.';
$heroTitle = 'The OCG Family'; $heroEyebrow = 'Our subsidiaries'; $heroText = 'Five specialized organizations working across construction, engineering, infrastructure, real estate, tourism and hospitality.'; $heroImage = '12/6.1-8.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$keys = ['occ'=>'OCC','obm'=>'OBM','walabu'=>'Walabu','eco'=>'ECO','ija'=>'IJA Developers'];
?>
<main id="main-content">
<?= ocg_page_nav(['overview'=>'Overview','occ'=>'OCC','obm'=>'OBM','walabu'=>'Walabu','eco'=>'ECO','ija'=>'IJA Developers']) ?>
<section class="section" id="overview"><div class="container"><div class="section-heading"><div><span class="eyebrow">One group, five specialists</span><h2>Specialized subsidiaries under one cohesive vision.</h2><p>OCG unites five subsidiaries to deliver construction, engineering, infrastructure, real estate and hospitality. Historical 2018 figures and 2019 (2026/2027) targets are shown separately.</p></div></div>
<div class="subsidiary-grid"><?php foreach ($subsidiaries as $s): ?><article class="subsidiary-card"><div class="subsidiary-mark"><?= e($s['mark']) ?></div><div class="small-label"><?= e($s['category']) ?></div><h3><?= e($s['name']) ?></h3><p><?= e($s['description']) ?></p><?php if (!empty($s['ceo'])): ?><p class="notice-legal"><strong>CEO:</strong> <?= e($s['ceo']) ?></p><?php endif; ?><a class="text-link" href="#<?= e(strtolower($s['short'] === 'IJA' ? 'ija' : $s['short'])) ?>">View profile <span aria-hidden="true">↓</span></a></article><?php endforeach; ?></div>
</div></section>
<?php foreach ($keys as $key => $label): $section = ocg_page_section('subsidiaries', $key, ['title'=>$label,'content'=>'','metadata'=>[]]); ?>
<section class="section <?= $key === 'obm' || $key === 'eco' ? 'section-muted' : '' ?>" id="<?= e($key) ?>"><div class="container"><?= ocg_subsidiary_card(['name'=>$section['title'] ?? $label,'content'=>$section['content'] ?? '','metadata'=>$section['metadata'] ?? []]) ?></div></section>
<?php endforeach; ?>
<section class="section section-muted"><div class="container"><p class="notice-legal">Historical 2018 figures and 2019 (2026/2027) targets are reporting-period-specific. Where source documents differ on chronology or current appointments, the website labels the information as reported and requires management confirmation.</p></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
