<?php
$pageTitle = 'Photo Gallery'; $pageDescription = 'Photo highlights from construction, infrastructure and development projects featured on OCG’s public website.';
$heroTitle = 'Photo Gallery'; $heroEyebrow = 'Gallery'; $heroText = 'Visual highlights from projects, places and people connected with OCG and its subsidiaries.'; $heroImage = '12/gololicha-2-1024x682.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$photos = [
 ['title'=>'Walabu industrial facility','category'=>'Industrial construction','img'=>'12/Walabu-Kegna.jpg'],
 ['title'=>'Walmal River irrigation','category'=>'Water & irrigation','img'=>'12/walmal-1024x576.webp'],
 ['title'=>'Waliso Integrated Bus Terminal','category'=>'Transport infrastructure','img'=>'12/waliso-.webp'],
 ['title'=>'Gololicha project visit','category'=>'Project visit','img'=>'12/gololicha-2-1024x682.webp'],
 ['title'=>'Urban corridor development','category'=>'Urban development','img'=>'12/photo_2025-12-17_14-55-02-1024x768.webp'],
 ['title'=>'Wanchi destination','category'=>'Tourism & hospitality','img'=>'09/wanchi-destination-1024x575.webp'],
 ['title'=>'OCG board information','category'=>'Corporate','img'=>'12/ocg-board-1024x558.webp'],
 ['title'=>'Building and development','category'=>'Built environment','img'=>'12/6.1-8.webp'],
];
?>
<main id="main-content"><section class="section"><div class="container"><div class="tabs"><a class="tab active" href="photo.php">Photos</a><a class="tab" href="video.php">Videos</a><a class="tab" href="events.php">Events</a><a class="tab" href="documents.php">Documents</a></div><div class="gallery-grid"><?php foreach ($photos as $photo): ?><a class="gallery-item" href="<?= e(image_url($photo['img'])) ?>" target="_blank" rel="noopener"><img src="<?= e(image_url($photo['img'])) ?>" alt="<?= e($photo['title']) ?>" loading="lazy"><span class="gallery-caption"><strong><?= e($photo['title']) ?></strong><span><?= e($photo['category']) ?></span></span></a><?php endforeach; ?></div><p class="notice-legal" style="margin-top:20px">Images currently load from the public OCG media library. Before switching hosting, download and store the approved images locally if the old media directory will no longer be available.</p></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
