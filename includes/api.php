<?php
// Public-site integration for the OCG TypeScript REST API.
// No secrets or database credentials belong in this file.

function ocg_api_base(): string {
    $configured = getenv('OCG_API_URL');
    if ($configured) {
        return rtrim($configured, '/');
    }
    return rtrim(base_url(), '/') . '/api/v1';
}

function ocg_api_origin(): string {
    $configured = getenv('OCG_API_URL');
    $url = $configured ?: base_url();
    $parts = parse_url($url);
    if (!$parts || !isset($parts['scheme'], $parts['host'])) {
        return '';
    }
    $origin = $parts['scheme'] . '://' . $parts['host'];
    if (!empty($parts['port'])) {
        $origin .= ':' . $parts['port'];
    }
    return $origin;
}

function ocg_mime_type(string $path): string {
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $mime = finfo_file($finfo, $path);
            finfo_close($finfo);
            if ($mime) {
                return $mime;
            }
        }
    }
    return 'application/octet-stream';
}

/**
 * @param array<string,string> $fields
 * @param array<string,array{path:string,name:string,mime?:string}> $files
 * @return array{0:string,1:string}
 */
function ocg_build_multipart(array $fields, array $files): array {
    $boundary = '----OCGBoundary' . bin2hex(random_bytes(16));
    $body = '';
    foreach ($fields as $name => $value) {
        $body .= '--' . $boundary . "\r\n";
        $body .= 'Content-Disposition: form-data; name="' . str_replace('"', '', $name) . "\"\r\n\r\n";
        $body .= $value . "\r\n";
    }
    foreach ($files as $name => $file) {
        $path = $file['path'];
        $filename = str_replace(['"', "\r", "\n"], '', $file['name']);
        $mime = $file['mime'] ?? ocg_mime_type($path);
        $contents = file_get_contents($path);
        if ($contents === false) {
            continue;
        }
        $body .= '--' . $boundary . "\r\n";
        $body .= 'Content-Disposition: form-data; name="' . $name . '"; filename="' . $filename . "\"\r\n";
        $body .= 'Content-Type: ' . $mime . "\r\n\r\n";
        $body .= $contents . "\r\n";
    }
    $body .= '--' . $boundary . "--\r\n";
    return [$body, $boundary];
}

/**
 * @param array<string,string> $fields
 * @param array<string,array{path:string,name:string,mime?:string}> $files
 * @return array{ok:bool,status:int,data:array|null}
 */
function ocg_api_request(string $method, string $path, array $body = [], array $files = []): array {
    $method = strtoupper($method);
    $path = '/' . ltrim($path, '/');
    $url = ocg_api_base() . $path;
    $headers = ['Accept: application/json'];
    $content = '';
    if ($files) {
        [$content, $boundary] = ocg_build_multipart($body, $files);
        $headers[] = 'Content-Type: multipart/form-data; boundary=' . $boundary;
    } elseif ($body && $method !== 'GET') {
        $content = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $headers[] = 'Content-Type: application/json';
    }

    $context = stream_context_create([
        'http' => [
            'method' => $method,
            'header' => implode("\r\n", $headers),
            'content' => $content,
            'timeout' => 3.5,
            'ignore_errors' => true,
            'protocol_version' => '1.1',
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);

    $http_response_header = [];
    $raw = @file_get_contents($url, false, $context);
    $status = 0;
    foreach ($http_response_header as $line) {
        if (preg_match('#HTTP/\S+\s+(\d{3})#', $line, $matches)) {
            $status = (int) $matches[1];
            break;
        }
    }
    if ($raw === false) {
        return ['ok' => false, 'status' => $status ?: 0, 'data' => null];
    }
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $data = null;
    }
    return ['ok' => $status >= 200 && $status < 300, 'status' => $status, 'data' => is_array($data) ? $data : null];
}

function ocg_cache_file(string $key): string {
    return storage_path('cache/' . $key . '.json');
}

/**
 * @param array<string,mixed> $params
 * @return array|null
 */
function ocg_api_content(string $resource, array $params = [], int $ttl = 30): ?array {
    $cacheKey = 'ocg_' . md5($resource . '|' . json_encode($params));
    $cacheFile = ocg_cache_file($cacheKey);
    $fresh = false;
    if (is_file($cacheFile) && (time() - filemtime($cacheFile) < $ttl)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if (is_array($cached)) {
            return $cached;
        }
        $fresh = true;
    }
    $query = $params ? '?' . http_build_query($params) : '';
    $response = ocg_api_request('GET', $resource . $query);
    if ($response['ok'] && isset($response['data']['data'])) {
        $data = $response['data']['data'];
        if (is_array($data)) {
            @file_put_contents($cacheFile, json_encode($data), LOCK_EX);
            return $data;
        }
    }
    if (is_file($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if (is_array($cached)) {
            return $cached;
        }
    }
    return null;
}

/**
 * @return array|null
 */
function ocg_api_item(string $resource, string $id): ?array {
    $response = ocg_api_request('GET', $resource . '/' . rawurlencode($id));
    if ($response['ok'] && isset($response['data']['data']) && is_array($response['data']['data'])) {
        return $response['data']['data'];
    }
    return null;
}

/**
 * @param array<string,mixed> $body
 * @return array{ok:bool,status:int,data:array|null}
 */
function ocg_api_post_json(string $path, array $body): array {
    return ocg_api_request('POST', $path, $body);
}

/**
 * @param array<string,string> $fields
 * @param array<string,array{path:string,name:string,mime?:string}> $files
 * @return array{ok:bool,status:int,data:array|null}
 */
function ocg_api_post_multipart(string $path, array $fields, array $files = []): array {
    return ocg_api_request('POST', $path, $fields, $files);
}

function ocg_media_url(mixed $asset): ?string {
    if (!is_array($asset)) {
        return null;
    }
    $url = $asset['url'] ?? null;
    if (!is_string($url) || $url === '') {
        return null;
    }
    if (preg_match('#^https?://#i', $url)) {
        return $url;
    }
    $origin = ocg_api_origin();
    if ($origin && str_starts_with($url, '/')) {
        return $origin . $url;
    }
    return $url;
}

/**
 * @return array<string,mixed>|null
 */
function ocg_public_stats(): ?array {
    $response = ocg_api_request('GET', '/stats');
    if ($response['ok'] && isset($response['data']['data']) && is_array($response['data']['data'])) {
        return $response['data']['data'];
    }
    return null;
}

function ocg_page_sections(string $page): array {
    $data = ocg_api_content('page-sections', ['page' => $page]);
    return is_array($data) ? $data : [];
}

function ocg_page_section(string $page, string $key, array $fallback = []): array {
    foreach (ocg_page_sections($page) as $section) {
        if (($section['sectionKey'] ?? '') === $key) {
            return $section;
        }
    }
    return $fallback;
}

function ocg_status_label(string $status): string {
    $labels = [
        'PROPOSED' => 'Proposed', 'PLANNING' => 'Planning', 'TENDERING' => 'Tendering',
        'AWARDED' => 'Awarded', 'STARTED' => 'Started', 'ONGOING' => 'Ongoing',
        'ON_HOLD' => 'On Hold', 'COMPLETED' => 'Completed', 'CANCELLED' => 'Cancelled',
        'JOB_VACANCY' => 'Job Vacancy', 'BID_TENDER' => 'Bid / Tender',
        'PROCUREMENT_NOTICE' => 'Procurement Notice', 'EXPRESSION_OF_INTEREST' => 'Expression of Interest',
        'CONTRACT_AWARD' => 'Contract Award', 'GENERAL_NOTICE' => 'General Notice',
        'TRAINING' => 'Training Opportunity', 'OTHER' => 'Other',
        'UPCOMING' => 'Upcoming', 'COMPLETED' => 'Completed', 'CANCELLED' => 'Cancelled',
        'OPEN' => 'Open', 'CLOSED' => 'Closed',
    ];
    return $labels[$status] ?? ucwords(strtolower(str_replace('_', ' ', $status)));
}

function ocg_format_date(?string $date, bool $withTime = false): string {
    if (!$date) {
        return '';
    }
    $timestamp = strtotime($date);
    if ($timestamp === false) {
        return '';
    }
    return date('j M Y' . ($withTime ? ', H:i' : ''), $timestamp);
}

function ocg_excerpt(?string $text, int $length = 150): string {
    $clean = trim(preg_replace('/\s+/', ' ', strip_tags((string) $text)) ?? '');
    if (mb_strlen($clean) <= $length) {
        return $clean;
    }
    return rtrim(mb_substr($clean, 0, $length)) . '…';
}

function ocg_kses_post(?string $html): string {
    $allowed = '<p><br><strong><b><em><i><u><s><ul><ol><li><blockquote><h2><h3><h4><h5><h6><a><table><thead><tbody><tr><th><td><span><div><figure><figcaption><img><hr>';
    return strip_tags((string) $html, $allowed);
}

function ocg_project_image(array $project): string {
    $url = ocg_media_url($project['coverImage'] ?? null);
    if ($url) {
        return $url;
    }
    $legacy = [
        'corridor-development' => '12/photo_2025-12-17_14-55-02-1024x768.webp',
        'waliso-integrated-bus-terminal' => '12/waliso-.webp',
        'walmal-river-irrigation' => '12/walmal-1024x576.webp',
        'oromia-supreme-court' => '12/ocg-board-1024x558.webp',
    ];
    return image_url($legacy[$project['slug'] ?? ''] ?? '12/6.1-8.webp');
}