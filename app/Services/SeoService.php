<?php

declare(strict_types=1);

namespace App\Services;

final class SeoService
{
    /** @param array<string, mixed> $config */
    public function __construct(private readonly array $config)
    {
    }

    /**
     * @param array<string, mixed> $page
     * @return array<string, mixed>
     */
    public function buildMeta(string $routeName, string $locale, array $page): array
    {
        $baseUrl = rtrim((string) $this->config['base_url'], '/');
        $routes = $this->config['routes'];
        $canonicalPath = $routes[$routeName][$locale] ?? '/';
        $canonicalUrl = $baseUrl . $canonicalPath;

        $alternates = [];
        foreach ($this->config['locales'] as $altLocale) {
            $path = $routes[$routeName][$altLocale] ?? '/';
            $alternates[] = [
                'hreflang' => $altLocale,
                'href' => $baseUrl . $path,
            ];
        }

        return [
            'title' => $page['title'] ?? $this->config['app_name'],
            'description' => $page['description'] ?? '',
            'keywords' => $page['keywords'] ?? '',
            'canonical' => $canonicalUrl,
            'alternates' => $alternates,
            'og_type' => $page['og_type'] ?? 'website',
            'twitter_card' => 'summary_large_image',
            'image' => $baseUrl . '/assets/img/og-cover.svg',
            'locale' => $locale === 'pt' ? 'pt_BR' : ($locale === 'en' ? 'en_US' : 'es_ES'),
        ];
    }

    /** @return array<int, string> */
    public function sitemapUrls(): array
    {
        $urls = [];
        $baseUrl = rtrim((string) $this->config['base_url'], '/');

        foreach ($this->config['routes'] as $routeLocales) {
            foreach ($routeLocales as $path) {
                $urls[] = $baseUrl . $path;
            }
        }

        return array_values(array_unique($urls));
    }
}
