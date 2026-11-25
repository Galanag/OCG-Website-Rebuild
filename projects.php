<?php
require_once __DIR__ . '/includes/data.php';
$pageTitle = 'Projects';
$pageDescription = 'Explore OCG’s published project register, including status, location, progress and delivery details.';
$heroTitle = 'Projects';
$heroEyebrow = 'Our project portfolio';
$heroText = 'Discover the construction, infrastructure and development projects published by Oro-Construction Group.';
$heroImage = '12/photo_2025-12-17_14-55-02-1024x768.webp';
require __DIR__ . '/includes/header.php';
require __DIR__ . '/includes/page-hero.php';

$page = max(1, (int)($_GET['page'] ?? 1));
$params = ['limit' => 12, 'page' => $page, 'sort' => '-publishedAt'];
if (!empty($_GET['q'])) $params['q'] = substr(trim($_GET['q']), 0, 200);
if (!empty($_GET['status'])) $params['status'] = preg_replace('/[^A-Z_]/', '', strtoupper($_GET['status']));
$data = ocg_api_content('projects', $params);
$items = $data['items'] ?? $projects;
$meta = $data['meta'] ?? ['page' => 1, 'pages' => 1, 'total' => count($items)];
?>
<main id="main-content">
<section class="section"><div class="container">
  <div class="section-heading"><div><span class="eyebrow">Project register</span><h2>Published projects</h2><p>Showing database-managed project records. Draft and unpublished projects are not exposed on this page.</p></div></div>
  <form class="filter-bar" method="get" action="projects.php">
    <label class="sr-only" for="project-search">Search projects</label><input id="project-search" name="q" value="<?= e($_GET['q'] ?? '') ?>" placeholder="Search by title, reference or location">
    <label class="sr-only" for="project-status">Project status</label><select id="project-status" name="status"><option value="">All statuses</option><?php foreach (ocg_status_labels() as $value => $label): ?><option value="<?= e($value) ?>" <?= (($_GET['status'] ?? '') === $value) ? 'selected' : '' ?>><?= e($label) ?></option><?php endforeach; ?></select>
    <button class="btn" type="submit">Apply filters</button><a class="btn btn-outline" href="projects.php">Clear</a>
  </form>
  <?= ocg_project_grid($items, 0, 'No published projects match the current filters.') ?>
  <?= ocg_pagination((int)$meta['page'], (int)$meta['pages'], 'projects.php') ?>
</div></section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>