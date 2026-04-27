<?php

declare(strict_types=1);

namespace App\Services;

final class Router
{
    /** @var array<string, array<string, callable>> */
    private array $routes = [];

    private $notFoundHandler = null;

    public function get(string $path, callable $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function add(string $method, string $path, callable $handler): void
    {
        $normalizedPath = $this->normalizePath($path);
        $this->routes[strtoupper($method)][$normalizedPath] = $handler;
    }

    public function setNotFoundHandler(callable $handler): void
    {
        $this->notFoundHandler = $handler;
    }

    public function dispatch(string $uri, string $method): void
    {
        $path = $this->normalizePath(parse_url($uri, PHP_URL_PATH) ?: '/');
        $httpMethod = strtoupper($method);

        $handler = $this->routes[$httpMethod][$path] ?? null;

        if ($handler === null) {
            if (is_callable($this->notFoundHandler)) {
                $response = ($this->notFoundHandler)($path);
                $this->emitResponse($response);
                return;
            }

            http_response_code(404);
            header('Content-Type: text/html; charset=UTF-8');
            echo 'Pagina nao encontrada';
            return;
        }

        $response = $handler();

        $this->emitResponse($response);
    }

    private function emitResponse(mixed $response): void
    {

        if (!is_array($response)) {
            echo (string) $response;
            return;
        }

        $status = (int) ($response['status'] ?? 200);
        $headers = $response['headers'] ?? [];
        $content = (string) ($response['content'] ?? '');

        http_response_code($status);
        foreach ($headers as $header => $value) {
            header(sprintf('%s: %s', $header, $value));
        }

        echo $content;
    }

    private function normalizePath(string $path): string
    {
        if ($path === '') {
            return '/';
        }

        $path = '/' . ltrim($path, '/');

        if ($path !== '/') {
            $path = rtrim($path, '/') . '/';
        }

        return $path;
    }
}
