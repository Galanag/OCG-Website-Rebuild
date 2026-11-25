<?php
$pageTitle = 'Photo, Video & Document Gallery'; $pageDescription = 'Photo highlights, video resources and public documents from OCG projects and corporate information.';
$heroTitle = 'OCG Gallery'; $heroEyebrow = 'Gallery'; $heroText = 'Visual highlights, video resources and approved documents from projects, places and people connected with OCG.'; $heroImage = '12/gololicha-2-1024x682.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$photos = [
 ['title'=>'Walabu industrial facility','category'=>'Industrial construction','img'=>'12/Walabu-Kegna.jpg'],
 ['title'=>'Walmal River irrigation','category'=>'Water & irrigation','img'=>'12/walmal-1024x576.webp'],
 ['title'=>'Waliso Integrated Bus Terminal','category'=>'Transport infrastructure','img'=>'12/waliso-.webp'],
 ['title'=>'Gololcha project visit','category'=>'Project visit','img'=>'12/gololicha-2-1024x682.webp'],
 ['title'=>'Urban corridor development','category'=>'Urban development','img'=>'12/photo_2025-12-17_14-55-02-1024x768.webp'],
 ['title'=>'Wanchi destination','category'=>'Tourism & hospitality','img'=>'09/wanchi-destination-1024x575.webp'],
 ['title'=>'OCG board information','category'=>'Corporate','img'=>'12/ocg-board-1024x558.webp'],
 ['title'=>'Building and development','category'=>'Built environment','img'=>'12/6.1-8.webp'],
];
?>
<main id="main-content">
<?= ocg_page_nav(['photos'=>'Photos','videos'=>'Videos','documents'=>'Documents']) ?>
<section class="section" id="photos"><div class="container"><div class="section-heading"><div><span class="eyebrow">Photo gallery</span><h2>Projects, places and people.</h2><p>Approved visual highlights from OCG and its specialist subsidiaries.</p></div></div><div class="gallery-grid"><?php foreach ($photos as $photo): ?><a class="gallery-item" href="<?= e(image_url($photo['img'])) ?>" target="_blank" rel="noopener"><img src="<?= e(image_url($photo['img'])) ?>" alt="<?= e($photo['title']) ?>" loading="lazy"><span class="gallery-caption"><strong><?= e($photo['title']) ?></strong><span><?= e($photo['category']) ?></span></span></a><?php endforeach; ?></div><p class="notice-legal" style="margin-top:20px">Images currently load from the public OCG media library. Before switching hosting, download and store approved images locally if the old media directory will no longer be available.</p></div></section>
<section class="section section-muted" id="videos"><div class="container"><div class="section-heading"><div><span class="eyebrow">Video library</span><h2>Video updates and project highlights.</h2></div></div><div class="empty-state"><h2>Video library ready for publication</h2><p>The current public Videos page did not expose a usable list of video items during review. Add approved video URLs or upload video files to publish this section.</p><a class="btn" href="contact.php">Contact the communications team <span aria-hidden="true">→</span></a></div></div></section>
<section class="section" id="documents"><div class="container"><div class="section-heading"><div><span class="eyebrow">Documents & resources</span><h2>Approved public documents.</h2></div></div><div class="empty-state"><h2>No public documents are listed here yet</h2><p>The existing Documents page did not expose downloadable resources during review. Add approved annual reports, brochures, policies or public notices in the document collection before launch.</p><a class="btn" href="contact.php">Request information <span aria-hidden="true">→</span></a></div></div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>