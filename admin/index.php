<?php
declare(strict_types=1);

header('X-Robots-Tag: noindex, nofollow');
$apiUrl = getenv('OCG_API_URL') ?: '';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#123b2b">
  <meta name="robots" content="noindex,nofollow">
  <title>OCG Administration</title>
  <link rel="icon" href="../assets/img/ocg-logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/admin.css">
  <script>window.OCG_API_URL = <?= json_encode($apiUrl, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;</script>
  <script src="assets/js/admin.js" defer></script>
</head>
<body>
  <div id="admin-app">
    <div class="admin-boot"><span class="admin-boot-mark">OCG</span><p>Loading administration…</p></div>
  </div>
  <noscript><div class="admin-noscript">JavaScript is required to use the OCG administration dashboard.</div></noscript>
</body>
</html>