<?php

declare(strict_types=1);

namespace App\Services;

final class ColorService
{
    /** @return array<int, string> */
    public function buildPalette(string $hex): array
    {
        $hex = strtoupper($hex);
        return [
            $hex,
            $this->shiftBrightness($hex, 12),
            $this->shiftBrightness($hex, -12),
            $this->shiftBrightness($hex, 24),
            $this->shiftBrightness($hex, -24),
        ];
    }

    private function shiftBrightness(string $hex, int $percent): string
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) !== 6) {
            return '#4F46E5';
        }

        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        $factor = $percent / 100;
        $r = (int) max(0, min(255, $r + (255 * $factor)));
        $g = (int) max(0, min(255, $g + (255 * $factor)));
        $b = (int) max(0, min(255, $b + (255 * $factor)));

        return sprintf('#%02X%02X%02X', $r, $g, $b);
    }
}
