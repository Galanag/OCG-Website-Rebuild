<?php
$pageTitle = 'Events'; $pageDescription = 'Public events and project milestones related to OCG and its subsidiaries.';
$heroTitle = 'Events & Milestones'; $heroEyebrow = 'Gallery'; $heroText = 'Moments that mark progress in construction, infrastructure and community development.'; $heroImage = '12/gololicha-2-1024x682.webp';
require __DIR__ . '/includes/header.php'; require __DIR__ . '/includes/page-hero.php';
$events = [
 ['title'=>'Inauguration of Gololcha Irrigation','text'=>'The existing OCG events page notes that the Gololcha irrigation project was inaugurated after project works were completed.','img'=>'12/gololicha-2-1024x682.webp'],
 ['title'=>'Social responsibility','text'=>'The public events page references community-oriented social service activity associated with the ECO building programme.','img'=>'12/Walabu-Kegna.jpg'],
 ['title'=>'Project and infrastructure visits','text'=>'Photo updates record visits to infrastructure and urban development work across OCG’s project environment.','img'=>'12/photo_2025-12-17_14-55-02-1024x768.webp'],
];
?>
<main id="main-content"><section class="section"><div class="container"><div class="tabs"><a class="tab" href="photo.php">Photos</a><a class="tab" href="video.php">Videos</a><a class="tab active" href="events.php">Events</a><a class="tab" href="documents.php">Documents</a></div><div class="cards-grid"><?php foreach ($events as $event): ?><article class="service-card"><div class="service-image"><img src="<?= e(image_url($event['img'])) ?>" alt="<?= e($event['title']) ?>" loading="lazy"></div><div class="service-body"><span class="pill">OCG update</span><h3 style="margin-top:11px"><?= e($event['title']) ?></h3><p><?= e($event['text']) ?></p></div></article><?php endforeach; ?></div></div></section></main>
<?php require __DIR__ . '/includes/footer.php'; ?>
