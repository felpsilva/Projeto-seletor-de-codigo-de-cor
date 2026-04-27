<?php

declare(strict_types=1);

use App\Services\I18n;
use App\Services\SeoService;
use App\Services\View;

$autoloadPath = __DIR__ . '/vendor/autoload.php';

if (!is_file($autoloadPath)) {
	http_response_code(500);
	header('Content-Type: text/plain; charset=UTF-8');
	echo "Dependencias nao instaladas. Execute 'composer install' ou suba o projeto via Docker.\n";
	return;
}

require_once $autoloadPath;

$config = require __DIR__ . '/config/app.php';

$view = new View(__DIR__ . '/app/Views');
$i18n = new I18n(__DIR__ . '/config/lang', $config['default_locale'], $config['locales']);
$seo = new SeoService($config);
