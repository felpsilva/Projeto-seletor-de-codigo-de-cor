<?php

declare(strict_types=1);

namespace App\Services;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

final class View
{
    private Environment $twig;

    public function __construct(string $viewPath)
    {
        $loader = new FilesystemLoader($viewPath);
        $this->twig = new Environment($loader, [
            'cache' => false,
            'autoescape' => 'html',
        ]);
    }

    /** @param array<string, mixed> $data */
    public function render(string $template, array $data = []): string
    {
        return $this->twig->render($template, $data);
    }
}
