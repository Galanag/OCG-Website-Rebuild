<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Subsidiaries';
$pageDescription = 'The five OCG subsidiaries, their mandates, reported 2018 historical performance and FY 2026/2027 strategic targets.';
$heroTitle = 'The OCG family'; $heroEyebrow = 'Our subsidiaries'; $heroText = 'Five specialized organizations working across construction, engineering, infrastructure, real estate, tourism and hospitality.'; $heroImage = '12/6.1-8.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
?>
<main id="main-content">
<?= ocg_page_nav(['overview'=>'Overview','occ'=>'OCC','obm'=>'OBM','walabu'=>'Walabu','eco'=>'ECO','ija'=>'IJA Developers']) ?>
<?= ocg_corporate_section('subsidiaries', 'overview', 'Five specialized subsidiaries') ?>
<?php foreach (['occ'=>'OCC','obm'=>'OBM','walabu'=>'Walabu','eco'=>'ECO','ija'=>'IJA Developers'] as $key => $label): $section = ocg_page_section('subsidiaries', $key, ['title'=>$label,'content'=>'','metadata'=>[]]); echo '<div id="' . e($key) . '">' . ocg_subsidiary_card(['name'=>$section['title'] ?? $label,'content'=>$section['content'] ?? '','metadata'=>$section['metadata'] ?? []]) . '</div>'; endforeach; ?>
<section class="section section-muted"><div class="container"><div class="notice-legal">Historical 2018 figures and FY 2026/2027 targets are reporting-period-specific. Establishment chronology and current leadership require management confirmation where the source documents differ.</div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>