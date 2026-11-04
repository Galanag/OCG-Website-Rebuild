<?php
$heroEyebrow = $heroEyebrow ?? 'ORO-CONSTRUCTION GROUP';
$heroTitle = $heroTitle ?? 'Building the future, together.';
$heroText = $heroText ?? SITE_TAGLINE;
$heroImage = $heroImage ?? '12/walmal-1024x576.webp';
?>
<section class="page-hero" style="--hero-image: url('<?= e(image_url($heroImage)) ?>')">
  <div class="container page-hero-content"><span class="eyebrow eyebrow-light"><?= e($heroEyebrow) ?></span><h1><?= e($heroTitle) ?></h1><p><?= e($heroText) ?></p><div class="breadcrumbs"><a href="index.php">Home</a><span>/</span><span><?= e($heroTitle) ?></span></div></div>
</section>
