<?php
// Rendering helpers for CMS-managed corporate profile sections.

function ocg_corporate_section(string $page, string $key, string $fallbackTitle, string $fallbackContent = '', string $className = 'section'): string {
    $section = ocg_page_section($page, $key, [
        'title' => $fallbackTitle,
        'content' => $fallbackContent,
        'metadata' => [],
    ]);
    $title = $section['title'] ?? $fallbackTitle;
    $content = $section['content'] ?? $fallbackContent;
    $metadata = is_array($section['metadata'] ?? null) ? $section['metadata'] : [];
    return '<section class="' . e($className) . '" id="' . e($key) . '"><div class="container">'
        . '<div class="section-heading"><div><span class="eyebrow">' . e(ocg_status_label($page)) . '</span><h2>' . e($title) . '</h2></div></div>'
        . ocg_kses_post($content)
        . '</div></section>';
}

function ocg_corporate_metadata(string $page, string $key): array {
    $section = ocg_page_section($page, $key, ['metadata' => []]);
    return is_array($section['metadata'] ?? null) ? $section['metadata'] : [];
}

function ocg_financial_chart(array $rows, string $label): string {
    $max = 1;
    foreach ($rows as $row) { $max = max($max, (float)($row['etb'] ?? 0)); }
    $bars = '';
    foreach ($rows as $row) {
        $width = max(3, round(((float)($row['etb'] ?? 0) / $max) * 100));
        $bars .= '<div class="financial-row"><span>' . e($row['year'] ?? '') . '</span><div class="financial-track"><div class="financial-fill" style="width:' . $width . '%"></div></div><strong>' . e(number_format((float)($row['etb'] ?? 0) / 1e9, 2)) . 'B ETB</strong></div>';
    }
    return '<div class="financial-chart" aria-label="' . e($label) . '">' . $bars . '</div>';
}

function ocg_subsidiary_card(array $subsidiary): string {
    $name = $subsidiary['name'] ?? '';
    $content = $subsidiary['content'] ?? '';
    $meta = is_array($subsidiary['metadata'] ?? null) ? $subsidiary['metadata'] : [];
    $historical = $meta['historical2018'] ?? [];
    $targets = $meta['targetsFY202627'] ?? [];
    return '<article class="subsidiary-profile"><div class="section-heading"><div><span class="eyebrow">' . e($meta['ceo'] ?? 'Subsidiary') . '</span><h2>' . e($name) . '</h2></div></div>'
        . ocg_kses_post($content)
        . '<div class="financial-grid">'
        . (!empty($historical['revenueETB']) ? '<div class="financial-card historical"><span>2018 Actual Revenue</span><strong>' . e(number_format((float)$historical['revenueETB'] / 1e9, 2)) . 'B ETB</strong></div>' : '')
        . (!empty($historical['grossProfitETB']) ? '<div class="financial-card historical"><span>2018 Actual Gross Profit</span><strong>' . e(number_format((float)$historical['grossProfitETB'] / 1e9, 2)) . 'B ETB</strong></div>' : '')
        . (!empty($targets['revenueETB']) ? '<div class="financial-card target"><span>FY 2026/2027 Revenue Target</span><strong>' . e(number_format((float)$targets['revenueETB'] / 1e9, 2)) . 'B ETB</strong></div>' : '')
        . (!empty($targets['grossProfitETB']) ? '<div class="financial-card target"><span>FY 2026/2027 Gross Profit Target</span><strong>' . e(number_format((float)$targets['grossProfitETB'] / 1e9, 2)) . 'B ETB</strong></div>' : '')
        . '</div></article>';
}