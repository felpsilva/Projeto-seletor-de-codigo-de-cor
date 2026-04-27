<?php

declare(strict_types=1);

namespace App\Models;

final class Page
{
    public function __construct(
        public readonly string $name,
        public readonly string $title,
        public readonly string $description,
        public readonly string $keywords
    ) {
    }
}
