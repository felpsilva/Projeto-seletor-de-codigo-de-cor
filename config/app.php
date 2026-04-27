<?php

declare(strict_types=1);

return [
    'app_name' => 'Color Picker Studio',
    'base_url' => getenv('APP_URL') ?: 'http://localhost:8080',
    'default_locale' => 'pt',
    'locales' => ['pt', 'en', 'es'],
    'google_analytics_id' => getenv('GOOGLE_ANALYTICS_ID') ?: 'G-XXXXXXXXXX',
    'google_adsense_client' => getenv('GOOGLE_ADSENSE_CLIENT') ?: 'ca-pub-0000000000000000',
    'enable_ads' => filter_var(getenv('ENABLE_ADS') ?: 'false', FILTER_VALIDATE_BOOL),
    'routes' => [
        'home' => [
            'pt' => '/',
            'en' => '/en/',
            'es' => '/es/',
        ],
        'about' => [
            'pt' => '/sobre/',
            'en' => '/en/about/',
            'es' => '/es/sobre/',
        ],
        'contact' => [
            'pt' => '/contato/',
            'en' => '/en/contact/',
            'es' => '/es/contacto/',
        ],
        'privacy' => [
            'pt' => '/politica-de-privacidade/',
            'en' => '/en/privacy-policy/',
            'es' => '/es/politica-de-privacidad/',
        ],
        'terms' => [
            'pt' => '/termos-de-uso/',
            'en' => '/en/terms-of-use/',
            'es' => '/es/terminos-de-uso/',
        ],
    ],
];
