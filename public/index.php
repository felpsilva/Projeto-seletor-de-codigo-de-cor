<?php

declare(strict_types=1);

use App\Services\Router;

require_once dirname(__DIR__) . '/bootstrap.php';

$router = new Router();

require dirname(__DIR__) . '/routes/web.php';

$router->dispatch($_SERVER['REQUEST_URI'] ?? '/', $_SERVER['REQUEST_METHOD'] ?? 'GET');
