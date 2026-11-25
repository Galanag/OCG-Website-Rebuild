<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Financial Performance & Outlook';
$pageDescription = 'Historical OCG financial performance, reported project backlog and FY 2026/2027 strategic targets, clearly labelled by reporting period.';
$heroTitle = 'Financial performance'; $heroEyebrow = 'Capital strength & outlook'; $heroText = 'Historical results, reported backlog and forward-looking FY 2026/2027 targets are presented separately.'; $heroImage = '12/walmal-1024x576.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$historical = ocg_corporate_metadata('financial', 'historical');
$targets = ocg_corporate_metadata('financial', 'targets');
$outlook = ocg_corporate_metadata('financial', 'outlook');
?>
<main id="main-content">
<?= ocg_page_nav(['historical'=>'Historical Performance','targets'=>'FY 2026/2027 Targets','outlook'=>'Outlook']) ?>
<section class="section" id="historical"><div class="container">
  <?= ocg_corporate_section('financial', 'historical', 'Historical financial performance') ?>
  <div class="financial-grid"><div class="financial-card historical"><span>2018 Actual Revenue</span><strong>31.9B+ ETB</strong></div><div class="financial-card historical"><span>2018 Gross Profit</span><strong>5.88B ETB</strong></div><div class="financial-card historical"><span>2018 Net Profit</span><strong>2.85B ETB</strong></div><div class="financial-card historical"><span>2018 Gross Margin</span><strong>15.35%</strong></div></div>
  <div class="section-heading"><div><h2>Historical revenue</h2><p>2016–2018 actual revenue, with 2018 asset base shown as a source projection.</p></div></div>
  <?= ocg_financial_chart($historical['revenue'] ?? [], 'Historical revenue') ?>
  <div class="section-heading" style="margin-top:28px"><div><h2>Asset development</h2><p>Reported asset base by year.</p></div></div>
  <?= ocg_financial_chart($historical['assets'] ?? [], 'Historical asset base') ?>
</div></section>
<section class="section section-muted" id="targets"><div class="container">
  <?= ocg_corporate_section('financial', 'targets', 'FY 2026/2027 strategic targets') ?>
  <div class="financial-grid"><div class="financial-card target"><span>Consolidated Revenue Target</span><strong>39.32B ETB</strong></div><div class="financial-card target"><span>Consolidated Gross Profit Target</span><strong>7.07B ETB</strong></div></div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Subsidiary</th><th>Revenue Target</th><th>Gross Profit Target</th></tr></thead><tbody><?php foreach (($targets['subsidiaries'] ?? []) as $subsidiary): ?><tr><td><strong><?= e($subsidiary['name'] ?? '') ?></strong></td><td><?= e(number_format((float)($subsidiary['revenueETB'] ?? 0), 2)) ?> ETB</td><td><?= e(number_format((float)($subsidiary['grossProfitETB'] ?? 0), 2)) ?> ETB</td></tr><?php endforeach; ?></tbody></table></div>
  <p class="notice-legal">Targets are not achieved revenue. The PPTX labels the plan “2019 (2026/2027)”; the newer profile presents FY 2026/2027 subsidiary targets.</p>
</div></section>
<section class="section" id="outlook"><div class="container">
  <?= ocg_corporate_section('financial', 'outlook', 'Financial sustainability and outlook') ?>
  <div class="financial-grid"><div class="financial-card"><span>Reported Active Backlog</span><strong>77.7B ETB</strong></div><div class="financial-card"><span>OCC Backlog</span><strong>62.2B ETB</strong></div><div class="financial-card"><span>Walabu Backlog</span><strong>8.1B ETB</strong></div><div class="financial-card"><span>OBM Backlog</span><strong>7.5B ETB</strong></div></div>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>