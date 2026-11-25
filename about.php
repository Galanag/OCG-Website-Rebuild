<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'About OCG';
$pageDescription = 'Official corporate profile, vision, mission, values, governance, leadership and historical CEO message for Oro-Construction Group.';
$heroTitle = 'Who we are'; $heroEyebrow = 'About OCG'; $heroText = 'Building a Shining Future under the Oromia Sovereign Fund, with five specialized subsidiaries and a commitment to sustainable development.'; $heroImage = '12/6.1-8.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$board = ocg_corporate_metadata('about', 'board');
$executives = ocg_corporate_metadata('about', 'executives');
$values = ocg_corporate_metadata('about', 'values')['values'] ?? [];
$strategy = ocg_corporate_metadata('home', 'strategy')['pillars'] ?? [];
?>
<main id="main-content">
<?= ocg_page_nav([
    'company-overview' => 'About OCG', 'vision' => 'Vision', 'mission' => 'Mission',
    'values' => 'Values', 'board' => 'Board', 'executives' => 'Executive Management',
    'ceo-message' => 'Historical CEO Message', 'strategy' => 'Strategy',
]) ?>
<?= ocg_corporate_section('about', 'company-overview', 'About OCG') ?>
<?= ocg_corporate_section('about', 'background', 'Background and history') ?>
<?= ocg_corporate_section('about', 'purpose', 'Corporate purpose') ?>
<?= ocg_corporate_section('about', 'osf', 'Under the Oromia Sovereign Fund') ?>
<?= ocg_corporate_section('about', 'structure', 'Five-subsidiary structure') ?>
<?= ocg_corporate_section('about', 'industry-position', 'Construction and real estate position') ?>
<?= ocg_corporate_section('about', 'contribution', 'Economic and social contribution') ?>
<?= ocg_corporate_section('about', 'commitments', 'Corporate commitments') ?>
<?= ocg_corporate_section('about', 'vision', 'Our vision') ?>
<?= ocg_corporate_section('about', 'mission', 'Our mission') ?>
<section class="section section-muted" id="values"><div class="container"><div class="section-heading"><div><span class="eyebrow">Our values</span><h2>Ten values guiding every project.</h2></div></div><div class="values-list"><?php foreach ($values as $index => $value): ?><article class="value-light"><span class="eyebrow"><?= e(str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT)) ?></span><h3><?= e($value) ?></h3></article><?php endforeach; ?></div></div></section>
<section class="section" id="board"><div class="container"><div class="section-heading"><div><span class="eyebrow">Governance</span><h2>Board of Directors</h2><p><?= e($board['reportingPeriod'] ?? 'Reported profile; appointment dates require confirmation.') ?></p></div></div><div class="leadership-grid"><?php foreach (($board['members'] ?? []) as $member): ?><article class="leader-card"><div class="leader-initial"><?= e(implode('', array_map(fn($part) => mb_substr($part, 0, 1), array_slice(preg_split('/\s+/', $member['name'] ?? '') ?: [], 0, 2)))) ?></div><div><h3><?= e($member['name'] ?? '') ?></h3><p><?= e($member['role'] ?? '') ?></p></div></article><?php endforeach; ?></div></div></section>
<section class="section section-muted" id="executives"><div class="container"><div class="section-heading"><div><span class="eyebrow">Executive management</span><h2>Group executive roles</h2><p><?= e($executives['reportingPeriod'] ?? 'Reported profile; appointment dates require confirmation.') ?></p></div></div><div class="leadership-grid"><?php foreach (($executives['executives'] ?? []) as $executive): ?><article class="leader-card"><div class="leader-initial"><?= e(implode('', array_map(fn($part) => mb_substr($part, 0, 1), array_slice(preg_split('/\s+/', $executive['name'] ?? '') ?: [], 0, 2)))) ?></div><div><h3><?= e($executive['name'] ?? '') ?></h3><p><?= e($executive['role'] ?? '') ?></p></div></article><?php endforeach; ?></div><div class="chip-list" style="margin-top:18px"><?php foreach (($executives['functions'] ?? []) as $function): ?><span class="chip"><?= e($function) ?></span><?php endforeach; ?></div></div></section>
<?= ocg_corporate_section('about', 'ceo-message', 'Historical CEO message — 2018 performance') ?>
<section class="section" id="strategy"><div class="container"><div class="section-heading"><div><span class="eyebrow">Strategic direction</span><h2>Six strategic pillars.</h2><p>Future ambitions are not presented as certified or completed work.</p></div></div><div class="strategy-grid"><?php foreach ($strategy as $index => $pillar): ?><article class="strategy-card"><span class="strategy-number"><?= e(str_pad((string)($index + 1), 2, '0', STR_PAD_LEFT)) ?></span><h3><?= e($pillar['title'] ?? '') ?></h3><div class="chip-list"><?php foreach (($pillar['items'] ?? []) as $item): ?><span class="chip"><?= e($item) ?></span><?php endforeach; ?></div></article><?php endforeach; ?></div></div></section>
<section class="section section-muted"><div class="container"><div class="cta-band"><div><span class="eyebrow eyebrow-light">Our subsidiaries</span><h2>Explore the OCG delivery network.</h2><p>Detailed subsidiary mandates, historical results and FY 2026/2027 targets are available in the subsidiary profiles.</p></div><div class="cta-band-actions"><a class="btn btn-light" href="subsidiaries.php">View subsidiaries <span aria-hidden="true">→</span></a></div></div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>