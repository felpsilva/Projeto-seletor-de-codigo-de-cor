# Color Picker Studio

Aplicacao web moderna para selecao de cores com arquitetura PHP MVC, Twig, SEO tecnico avancado, internacionalizacao e base pronta para monetizacao com Google AdSense.

## Objetivos de produto

- Melhorar elegibilidade para AdSense (navegacao clara, paginas institucionais, conteudo robusto)
- Aumentar trafego organico com SEO tecnico e conteudo educativo
- Entregar UX responsiva, rapida e orientada a retencao
- Escalar com arquitetura limpa e separacao de responsabilidades

## Arquitetura

```text
/app
  /Controllers
  /Models
  /Services
  /Views
/public
  /assets
/routes
/config
```

### Stack

- Backend: PHP 8.1+ (sem framework pesado)
- Template engine: Twig
- Frontend: CSS + JavaScript Vanilla
- Infra: Docker (PHP-FPM + Nginx)

## Funcionalidades principais

- Conta-gotas por pixel em canvas (client-side)
- Conversao de cor para HEX, RGB e HSL
- Geracao de paletas automaticas:
  - Complementar
  - Analoga
  - Triade
  - Tetradica
  - Monocromatica
- Geracao de escalas:
  - Escala de luz
  - Escala de sombra
- Copia de cores com 1 clique
- Historico local de cores
- Exportacao de paleta em JSON e imagem
- Modo escuro com persistencia via localStorage

## SEO tecnico implementado

- Meta tags dinamicas por rota e idioma
- Open Graph e Twitter Cards
- Structured Data (WebApplication, FAQPage, HowTo)
- Canonical + hreflang + alternates
- Sitemap dinamico em /sitemap.xml
- Robots dinamico em /robots.txt

## Internacionalizacao

- Idiomas suportados:
  - Portugues: /
  - Ingles: /en/
  - Espanhol: /es/
- Traducoes em arquivos dedicados:
  - config/lang/pt.php
  - config/lang/en.php
  - config/lang/es.php

## Paginas institucionais

- Sobre
- Contato
- Politica de Privacidade
- Termos de Uso

## Analytics e Ads

- Google Analytics preparado por variavel de ambiente
- Estrutura de eventos pronta:
  - pick_color
  - copy_color_code
  - change_harmony
  - export_palette_json
  - export_palette_png
- Slots de anuncio preparados para AdSense (habilitacao por flag)

## Seguranca

- Sanitizacao basica de entrada
- Nginx com bloqueio de arquivos sensiveis (.env, Dockerfile, pastas internas)
- Processamento de imagem no cliente (sem upload no servidor)

## Rodando localmente

### Opcao 1: Docker

```bash
docker compose up --build
```

Aplicacao: http://localhost:8080

### Opcao 2: PHP embutido

```bash
composer install
composer dump-autoload
php -S 0.0.0.0:8080 -t public public/index.php
```

## Variaveis de ambiente

Use .env (base em .env.example):

- APP_URL
- ENABLE_ADS
- GOOGLE_ANALYTICS_ID
- GOOGLE_ADSENSE_CLIENT

## Rotas principais

- /, /en/, /es/
- /sobre/, /en/about/, /es/sobre/
- /contato/, /en/contact/, /es/contacto/
- /politica-de-privacidade/, /en/privacy-policy/, /es/politica-de-privacidad/
- /termos-de-uso/, /en/terms-of-use/, /es/terminos-de-uso/
- /robots.txt
- /sitemap.xml

## Proximos passos recomendados

- Adicionar testes de integracao de rotas (PHPUnit)
- Incluir cache de Twig e cache HTTP para producao
- Integrar CI para lint e validacao automatica de SEO tecnico

---

