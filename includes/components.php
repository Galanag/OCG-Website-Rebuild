<?php
// Reusable public-site presentation components.

function ocg_status_class(string $status): string {
    $classes = [
        'ONGOING' => 'status-pill status-pill-olive',
        'STARTED' => 'status-pill status-pill-olive',
        'COMPLETED' => 'status-pill status-pill-dark',
        'PROPOSED' => 'status-pill status-pill-red',
        'PLANNING' => 'status-pill status-pill-olive',
        'TENDERING' => 'status-pill status-pill-olive',
        'AWARDED' => 'status-pill status-pill-olive',
        'ON_HOLD' => 'status-pill status-pill-red',
        'CANCELLED' => 'status-pill status-pill-red',
        'OPEN' => 'status-pill status-pill-olive',
        'CLOSED' => 'status-pill status-pill-red',
        'UPCOMING' => 'status-pill status-pill-olive',
    ];
    return $classes[$status] ?? 'status-pill';
}

function ocg_progress_bar(float|int $progress): string {
    $value = max(0, min(100, (int) $progress));
    return '<div class="status-progress-wrap"><div class="status-progress"><span style="width:' . $value . '%"></span></div><span class="status-progress-label">' . $value . '% complete</span></div>';
}

function ocg_project_card(array $project): string {
    $slug = $project['slug'] ?? '';
    $title = $project['title'] ?? 'Project';
    $status = $project['status'] ?? 'PROPOSED';
    $image = ocg_project_image($project);
    $progress = (int) ($project['progress'] ?? 0);
    return '<article class="project-card">'
        . '<div class="project-card-image"><img src="' . e($image) . '" alt="' . e($title) . '" loading="lazy"><span class="' . ocg_status_class($status) . '">' . e(ocg_status_label($status)) . '</span></div>'
        . '<div class="project-card-body"><span>' . e($project['category'] ?? 'Project') . '</span><h3>' . e($title) . '</h3>'
        . '<p>' . e(ocg_excerpt($project['shortDescription'] ?? $project['description'] ?? '', 145)) . '</p>'
        . '<div class="project-card-footer"><span><strong>' . e($project['location'] ?? 'Ethiopia') . '</strong><small>Updated ' . e(ocg_format_date($project['updatedAt'] ?? $project['publishedAt'] ?? null)) . '</small></span><a class="text-link" href="project-detail.php?slug=' . e(rawurlencode($slug)) . '">View <span aria-hidden="true">↗</span></a></div>'
        . '</div></article>';
}

function ocg_page_nav(array $items): string {
    if (count($items) < 2) {
        return '';
    }
    $links = '';
    foreach ($items as $id => $label) {
        $links .= '<a class="page-nav-link" href="#' . e($id) . '" data-section-link="' . e($id) . '">' . e($label) . '</a>';
    }
    return '<nav class="page-section-nav" aria-label="On this page"><span class="page-nav-label">On this page</span>' . $links . '</nav>';
}

function ocg_status_labels(): array {
    return [
        'PROPOSED' => 'Proposed', 'PLANNING' => 'Planning', 'TENDERING' => 'Tendering',
        'AWARDED' => 'Awarded', 'STARTED' => 'Started', 'ONGOING' => 'Ongoing',
        'ON_HOLD' => 'On Hold', 'COMPLETED' => 'Completed', 'CANCELLED' => 'Cancelled',
    ];
}

function ocg_announcement_categories(): array {
    return [
        'JOB_VACANCY' => 'Job Vacancies', 'BID_TENDER' => 'Bids & Tenders',
        'PROCUREMENT_NOTICE' => 'Procurement Notices', 'EXPRESSION_OF_INTEREST' => 'Expressions of Interest',
        'CONTRACT_AWARD' => 'Contract Awards', 'GENERAL_NOTICE' => 'General Notices',
        'TRAINING' => 'Training Opportunities', 'OTHER' => 'Other Announcements',
    ];
}

function ocg_project_grid(array $projects, int $limit = 0, string $empty = 'No projects have been published yet.'): string {
    if ($limit > 0) {
        $projects = array_slice($projects, 0, $limit);
    }
    if (!$projects) {
        return '<div class="empty-state"><h2>' . e($empty) . '</h2></div>';
    }
    return '<div class="project-grid">' . implode('', array_map('ocg_project_card', $projects)) . '</div>';
}

function ocg_announcement_card(array $announcement): string {
    $state = $announcement['state'] ?? 'OPEN';
    $deadline = $announcement['submissionDeadline'] ?? $announcement['deadline'] ?? null;
    return '<article class="notice">'
        . '<div class="notice-topline"><span class="' . ocg_status_class($state) . '">' . e(ocg_status_label($state)) . '</span><span>' . e(ocg_status_label($announcement['category'] ?? 'GENERAL_NOTICE')) . '</span></div>'
        . '<h3>' . e($announcement['title'] ?? 'Announcement') . '</h3>'
        . '<p>' . e(ocg_excerpt($announcement['summary'] ?? $announcement['content'] ?? '', 170)) . '</p>'
        . '<div class="notice-meta">'
        . ($announcement['reference'] ? '<span>Ref. ' . e($announcement['reference']) . '</span>' : '')
        . ($deadline ? '<span>Deadline: ' . e(ocg_format_date($deadline)) . '</span>' : '')
        . '</div>'
        . '<div class="notice-bottom"><a class="text-link" href="announcement-detail.php?slug=' . e(rawurlencode($announcement['slug'] ?? '')) . '">View notice <span aria-hidden="true">→</span></a>'
        . (!empty($announcement['externalApplicationUrl']) ? '<a class="text-link" href="' . e($announcement['externalApplicationUrl']) . '" target="_blank" rel="noopener">Apply externally ↗</a>' : '')
        . '</div></article>';
}

function ocg_news_card(array $article): string {
    $image = ocg_media_url($article['featuredImage'] ?? null);
    return '<article class="article-card">'
        . ($image ? '<img src="' . e($image) . '" alt="' . e($article['title'] ?? '') . '" loading="lazy">' : '')
        . '<span>' . e($article['category'] ?? 'News') . '</span>'
        . '<h3>' . e($article['title'] ?? 'News article') . '</h3>'
        . '<p>' . e(ocg_excerpt($article['summary'] ?? $article['content'] ?? '', 140)) . '</p>'
        . '<a class="text-link" href="news-detail.php?slug=' . e(rawurlencode($article['slug'] ?? '')) . '">Read more <span aria-hidden="true">→</span></a></article>';
}

function ocg_event_card(array $event): string {
    $image = ocg_media_url($event['eventImage'] ?? null);
    return '<article class="news-card">'
        . '<div class="news-card-head"><span>' . e($event['category'] ?? 'Event') . '</span><span>' . e(ocg_format_date($event['startsAt'] ?? null)) . '</span></div>'
        . '<h3>' . e($event['title'] ?? 'Event') . '</h3>'
        . '<p>' . e(ocg_excerpt($event['description'] ?? '', 145)) . '</p>'
        . '<a class="text-link" href="event-detail.php?slug=' . e(rawurlencode($event['slug'] ?? '')) . '">Event details <span aria-hidden="true">→</span></a>'
        . ($image ? '<div style="margin-top:12px"><img src="' . e($image) . '" alt="' . e($event['title'] ?? '') . '" loading="lazy"></div>' : '')
        . '</article>';
}

function ocg_pagination(int $page, int $pages, string $resource): string {
    if ($pages <= 1) {
        return '';
    }
    $links = '';
    for ($index = 1; $index <= $pages; $index++) {
        $query = $_GET;
        $query['page'] = $index;
        $url = $resource . '?' . http_build_query($query);
        $links .= '<a class="tab ' . ($index === $page ? 'active' : '') . '" href="' . e($url) . '">' . $index . '</a>';
    }
    return '<nav class="tabs" aria-label="Pagination" style="margin-top:18px">' . $links . '</nav>';
}