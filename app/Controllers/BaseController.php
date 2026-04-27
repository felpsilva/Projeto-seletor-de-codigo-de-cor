<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\I18n;
use App\Services\SeoService;
use App\Services\View;

abstract class BaseController
{
    /** @param array<string, mixed> $config */
    public function __construct(
        protected readonly View $view,
        protected readonly I18n $i18n,
        protected readonly SeoService $seo,
        protected readonly array $config
    ) {
    }

    /** @param array<string, string> $headers */
    protected function response(string $content, int $status = 200, array $headers = []): array
    {
        return [
            'status' => $status,
            'headers' => $headers,
            'content' => $content,
        ];
    }
}
