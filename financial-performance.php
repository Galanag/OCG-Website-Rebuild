<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Financial Performance & Outlook';
$pageDescription = 'OCG historical financial performance, active backlog and 2019 (2026/2027) strategic targets, clearly labelled by reporting period.';
$heroTitle = 'Financial Performance'; $heroEyebrow = 'Capital strength & outlook'; $heroText = 'Historical results, reported backlog and forward-looking 2019 (2026/2027) targets are presented separately.'; $heroImage = '12/walmal-1024x576.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$historical = ocg_corporate_metadata('financial', 'historical');
$targets = ocg_corporate_metadata('financial', 'targets');
$outlook = ocg_corporate_metadata('financial', 'outlook');
?>
<main id="main-content">
<?= ocg_page_nav(['historical'=>'Historical Performance','targets'=>'2019 Plan Targets','outlook'=>'Outlook']) ?>

<section class="section" id="historical"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Historical performance</span><h2>Record 2018 performance.</h2><p>Historical figures are presented as reported and are not current results.</p></div></div>
  <div class="financial-grid">
    <div class="financial-card historical"><span>2018 Actual Revenue</span><strong>31.9B+ ETB</strong><div class="notice-legal">+40.5% YoY Growth</div></div>
    <div class="financial-card historical"><span>2018 Gross Profit</span><strong>5.88B ETB</strong></div>
    <div class="financial-card historical"><span>2018 Net Profit</span><strong>2.85B ETB</strong></div>
    <div class="financial-card historical"><span>2018 Gross Margin</span><strong>15.35%</strong></div>
  </div>
  <div class="split-grid" style="margin-top:30px">
    <div><h3>Consolidated Revenue Trajectory (Billion ETB)</h3><?= ocg_financial_chart($historical['revenue'] ?? [], 'Historical revenue') ?></div>
    <div><h3>Total Asset Base Expansion (Billion ETB)</h3><?= ocg_financial_chart($historical['assets'] ?? [], 'Historical asset base') ?><p class="notice-legal" style="margin-top:10px">2018 asset base is marked as projection in the source profile.</p></div>
  </div>
</div></section>

<section class="section section-muted" id="targets"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Forward-looking targets</span><h2>2019 (2026/2027) Strategic Plan Targets.</h2><p>Targets are not achieved revenue. They are presented as reported in the source profile.</p></div></div>
  <div class="financial-grid">
    <div class="financial-card target"><span>Consolidated Revenue Target</span><strong>39.32B ETB</strong></div>
    <div class="financial-card target"><span>Consolidated Gross Profit Target</span><strong>7.07B ETB</strong></div>
  </div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Subsidiary</th><th>Revenue Target</th><th>Gross Profit Target</th></tr></thead><tbody><?php foreach (($targets['subsidiaries'] ?? []) as $s): ?><tr><td><strong><?= e($s['name'] ?? '') ?></strong></td><td><?= e(number_format((float)($s['revenueETB'] ?? 0)/1e9, 2)) ?>B ETB</td><td><?= e(number_format((float)($s['grossProfitETB'] ?? 0)/1e9, 2)) ?>B ETB</td></tr><?php endforeach; ?></tbody></table></div>
</div></section>

<section class="section" id="outlook"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Outlook</span><h2>Active backlog and sustainability.</h2></div></div>
  <?= ocg_corporate_section('financial', 'outlook', 'Financial sustainability and outlook') ?>
  <div class="financial-grid">
    <div class="financial-card"><span>Reported Active Backlog</span><strong>77.7B ETB</strong></div>
    <div class="financial-card"><span>OCC Backlog</span><strong>62.2B ETB</strong></div>
    <div class="financial-card"><span>Walabu Backlog</span><strong>8.1B ETB</strong></div>
    <div class="financial-card"><span>OBM Backlog</span><strong>7.5B ETB</strong></div>
  </div>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
