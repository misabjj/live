<?php

namespace App\Support;

use Illuminate\Support\Str;

class BrowserFingerprint
{
    public static function getCookieName(): string
    {
        return str_replace(' ', '_', strtolower(env('APP_NAME', 'laravel'))).'_bf';
    }

    /**
     * Get browser tracker from request (cookie or header)
     */
    public static function getFingerprint(): ?string
    {
        return request()->cookie(self::getCookieName());
    }

    /**
     * Get or create browser tracker for the current request
     */
    public static function setFingerprint(string $fingerprint): void
    {
        cookie()->queue(
            cookie(self::getCookieName(), $fingerprint, 60 * 24 * 365), // 1 year
        );
    }

    /**
     * Generate fingerprint based on request headers for additional tracking
     */
    public static function generateFingerprint(): string
    {
        return Str::ulid()->toString();
    }
}
