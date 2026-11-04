<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

function e(mixed $value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function set_flash(string $type, string $message): void {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}
function get_flash(): ?array {
    if (empty($_SESSION['flash'])) return null;
    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return is_array($flash) ? $flash : null;
}
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return (string)$_SESSION['csrf_token'];
}
function verify_csrf(): bool {
    $sent = (string)($_POST['csrf_token'] ?? '');
    return $sent !== '' && !empty($_SESSION['csrf_token']) && hash_equals((string)$_SESSION['csrf_token'], $sent);
}
function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}
function safe_mail(string $subject, string $body, ?string $replyTo = null): bool {
    $to = SITE_EMAIL;
    $host = preg_replace('/[^a-zA-Z0-9.-]/', '', (string)($_SERVER['HTTP_HOST'] ?? 'localhost')) ?: 'localhost';
    $from = filter_var(MAIL_FROM, FILTER_VALIDATE_EMAIL) ? MAIL_FROM : 'website@' . $host;
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: OCG Website <' . $from . '>',
    ];
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
    return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
}
function clean_line(string $value, int $max = 200): string {
    $value = trim(preg_replace('/[\r\n\t]+/', ' ', $value) ?? '');
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}
function clean_message(string $value, int $max = 4000): string {
    $value = trim(str_replace("\0", '', $value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}
function current_file(): string {
    return basename((string)($_SERVER['SCRIPT_NAME'] ?? 'index.php'));
}
function nav_is_active(array $files): bool {
    return in_array(current_file(), $files, true);
}
function image_url(string $path): string {
    // Use the source host that actually serves the public legacy media URL.
    $path = ltrim($path, '/');
    $legacyHostFiles = [
        'Walabu-Kegna.jpg',
        'photo_2025-12-17_14-55-02-1024x768.webp',
        'waliso-.webp',
        'walmal-1024x576.webp',
    ];
    $file = basename($path);
    $host = in_array($file, $legacyHostFiles, true) ? 'https://ocg.ijadevelopers.com' : 'https://ocg.gov.et';
    return $host . '/wp-content/uploads/2025/' . $path;
}
function render_flash(): void {
    $flash = get_flash();
    if (!$flash) return;
    $class = ($flash['type'] ?? '') === 'success' ? 'notice notice-success' : 'notice notice-error';
    echo '<div class="notice-wrap container"><div class="' . e($class) . '" role="status">' . e($flash['message'] ?? '') . '</div></div>';
}
