<?php

declare(strict_types=1);

use App\Controllers\PageController;

$controller = new PageController($view, $i18n, $seo, $config);

foreach ($config['routes'] as $routeName => $localizedPaths) {
    foreach ($localizedPaths as $locale => $path) {
        if ($routeName === 'home') {
            $router->get($path, static fn () => $controller->home($locale));
            continue;
        }

        $router->get($path, static fn () => $controller->staticPage($routeName, $locale));
    }
}

$router->get('/robots.txt', static fn () => $controller->robots());
$router->get('/sitemap.xml', static fn () => $controller->sitemap());

$router->get('/sobre.html', static fn () => $controller->redirect('/sobre/'));
$router->get('/politica-privacidade.html', static fn () => $controller->redirect('/politica-de-privacidade/'));
$router->get('/en/about.html', static fn () => $controller->redirect('/en/about/'));
$router->get('/es/sobre.html', static fn () => $controller->redirect('/es/sobre/'));

$router->setNotFoundHandler(static function (string $path) use ($controller): array {
    if (str_starts_with($path, '/en/')) {
        return $controller->notFound('en');
    }

    if (str_starts_with($path, '/es/')) {
        return $controller->notFound('es');
    }

    return $controller->notFound('pt');
});
