<?php
declare(strict_types=1);

/**
 * Single PHP bootstrap for public pages.
 * Configuration is loaded first, then functions and API utilities.
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/functions.php';