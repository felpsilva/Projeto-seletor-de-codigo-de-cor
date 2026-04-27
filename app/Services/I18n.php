<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

final class I18n
{
    /** @var string[] */
    private array $supportedLocales;

    private string $defaultLocale;

    /** @var array<string, array<string, mixed>> */
    private array $loaded = [];

    public function __construct(
        private readonly string $langPath,
        string $defaultLocale,
        array $supportedLocales
    ) {
        $this->defaultLocale = $defaultLocale;
        $this->supportedLocales = $supportedLocales;
    }

    public function locale(string $requested): string
    {
        return in_array($requested, $this->supportedLocales, true)
            ? $requested
            : $this->defaultLocale;
    }

    /** @return array<string, mixed> */
    public function dictionary(string $locale): array
    {
        $locale = $this->locale($locale);

        if (!isset($this->loaded[$locale])) {
            $file = $this->langPath . '/' . $locale . '.php';
            if (!is_file($file)) {
                throw new RuntimeException('Arquivo de idioma nao encontrado: ' . $file);
            }
            $data = require $file;
            if (!is_array($data)) {
                throw new RuntimeException('Arquivo de idioma invalido: ' . $file);
            }
            $this->loaded[$locale] = $data;
        }

        return $this->loaded[$locale];
    }
}
