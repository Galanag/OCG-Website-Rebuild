<?php
declare(strict_types=1);

/**
 * OCG website configuration.
 * Change these values before publishing if the official contact information differs.
 */
define('SITE_NAME', 'Oro-Construction Group');
define('SITE_SHORT_NAME', 'OCG');
define('SITE_EMAIL', getenv('OCG_CONTACT_EMAIL') ?: 'info@ocg.et');
define('SITE_ADDRESS', 'Bole Michael, Addis Ababa, Ethiopia');
define('SITE_TAGLINE', 'Building Stronger Communities, Delivering Value-Driven Construction Across Africa');
define('MAIL_FROM', getenv('OCG_MAIL_FROM') ?: SITE_EMAIL);
define('UPLOAD_DIR', dirname(__DIR__) . '/storage/partner-uploads');
define('MAX_UPLOAD_BYTES', 5 * 1024 * 1024);

if (session_status() !== PHP_SESSION_ACTIVE) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => $isHttps,
        'samesite' => 'Lax',
    ]);
    session_start();
}
