<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\Page;
use DateTimeImmutable;

final class PageController extends BaseController
{
    public function home(string $locale): array
    {
        $dict = $this->i18n->dictionary($locale);
        $page = new Page(
            'home',
            (string) $dict['seo']['home']['title'],
            (string) $dict['seo']['home']['description'],
            (string) $dict['seo']['home']['keywords']
        );

        $meta = $this->seo->buildMeta('home', $locale, [
            'title' => $page->title,
            'description' => $page->description,
            'keywords' => $page->keywords,
        ]);

        $schema = [
            [
                '@context' => 'https://schema.org',
                '@type' => 'WebApplication',
                'name' => $this->config['app_name'],
                'applicationCategory' => 'DesignApplication',
                'operatingSystem' => 'Web',
                'url' => $meta['canonical'],
                'description' => $page->description,
                'inLanguage' => $meta['locale'],
                'offers' => [
                    '@type' => 'Offer',
                    'price' => '0',
                    'priceCurrency' => 'USD',
                ],
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'HowTo',
                'name' => $dict['home']['howto_title'],
                'step' => [
                    ['@type' => 'HowToStep', 'text' => $dict['home']['howto_step_1']],
                    ['@type' => 'HowToStep', 'text' => $dict['home']['howto_step_2']],
                    ['@type' => 'HowToStep', 'text' => $dict['home']['howto_step_3']],
                ],
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => [
                    [
                        '@type' => 'Question',
                        'name' => $dict['home']['faq'][0]['q'],
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $dict['home']['faq'][0]['a'],
                        ],
                    ],
                    [
                        '@type' => 'Question',
                        'name' => $dict['home']['faq'][1]['q'],
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $dict['home']['faq'][1]['a'],
                        ],
                    ],
                    [
                        '@type' => 'Question',
                        'name' => $dict['home']['faq'][2]['q'],
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $dict['home']['faq'][2]['a'],
                        ],
                    ],
                ],
            ],
        ];

        $html = $this->view->render('pages/home.html', [
            'locale' => $locale,
            'dict' => $dict,
            'meta' => $meta,
            'current_route' => 'home',
            'routes' => $this->config['routes'],
            'schema_json' => json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'ga_id' => $this->config['google_analytics_id'],
            'ads_client' => $this->config['google_adsense_client'],
            'enable_ads' => $this->config['enable_ads'],
        ]);

        return $this->response($html, 200, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    public function staticPage(string $routeName, string $locale): array
    {
        $dict = $this->i18n->dictionary($locale);
        $pageSeo = $dict['seo'][$routeName] ?? $dict['seo']['home'];

        $meta = $this->seo->buildMeta($routeName, $locale, [
            'title' => $pageSeo['title'],
            'description' => $pageSeo['description'],
            'keywords' => $pageSeo['keywords'],
        ]);

        $template = 'pages/' . $routeName . '.html';

        $html = $this->view->render($template, [
            'locale' => $locale,
            'dict' => $dict,
            'meta' => $meta,
            'current_route' => $routeName,
            'routes' => $this->config['routes'],
            'ga_id' => $this->config['google_analytics_id'],
            'ads_client' => $this->config['google_adsense_client'],
            'enable_ads' => $this->config['enable_ads'],
        ]);

        return $this->response($html, 200, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    public function sitemap(): array
    {
        $items = [];
        $now = (new DateTimeImmutable())->format('Y-m-d');

        foreach ($this->seo->sitemapUrls() as $url) {
            $items[] = [
                'loc' => $url,
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => str_ends_with($url, '/en/') || str_ends_with($url, '/es/') || str_ends_with($url, '/') ? '0.9' : '0.7',
            ];
        }

        $xml = $this->view->render('pages/sitemap.html', ['items' => $items]);

        return $this->response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots(): array
    {
        $baseUrl = rtrim((string) $this->config['base_url'], '/');
        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Disallow: /.env\n";
        $content .= "Disallow: /Dockerfile\n";
        $content .= "Disallow: /docker-compose.yml\n";
        $content .= "Disallow: /config/\n";
        $content .= "Disallow: /app/\n";
        $content .= "Sitemap: {$baseUrl}/sitemap.xml\n";

        return $this->response($content, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    public function redirect(string $to, int $status = 301): array
    {
        return $this->response('', $status, ['Location' => $to]);
    }

    public function notFound(string $locale): array
    {
        $dict = $this->i18n->dictionary($locale);
        $meta = $this->seo->buildMeta('home', $locale, [
            'title' => '404 | ' . $this->config['app_name'],
            'description' => (string) $dict['errors']['not_found_description'],
            'keywords' => '',
        ]);

        $html = $this->view->render('pages/404.html', [
            'locale' => $locale,
            'dict' => $dict,
            'meta' => $meta,
            'current_route' => 'home',
            'routes' => $this->config['routes'],
        ]);

        return $this->response($html, 404, ['Content-Type' => 'text/html; charset=UTF-8']);
    }
}
