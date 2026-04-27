<?php

declare(strict_types=1);

namespace App\Services;

final class SecurityService
{
    public function sanitizeText(string $value): string
    {
        $trimmed = trim($value);
        $stripped = strip_tags($trimmed);
        return htmlspecialchars($stripped, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /** @param array<string, mixed> $input */
    public function sanitizeArray(array $input): array
    {
        $result = [];
        foreach ($input as $key => $value) {
            $cleanKey = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) $key) ?: 'key';
            if (is_string($value)) {
                $result[$cleanKey] = $this->sanitizeText($value);
                continue;
            }
            $result[$cleanKey] = $value;
        }
        return $result;
    }
}
