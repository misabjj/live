<?php

namespace App\Support;

use Illuminate\Support\Facades\Session;

class Toast
{
    public static function success(string $message): void
    {
        self::put('success', $message);
    }

    public static function error(string $message): void
    {
        self::put('error', $message);
    }

    public static function warning(string $message): void
    {
        self::put('warning', $message);
    }

    public static function info(string $message): void
    {
        self::put('info', $message);
    }

    public static function pull(): array
    {
        return Session::pull('toasts', []);
    }

    public static function get(): array
    {
        return Session::get('toasts', []);
    }

    private static function put(string $type, string $message): void
    {
        $toast = [
            'type' => $type,
            'message' => $message,
            'id' => uniqid(),
        ];

        $toasts = self::get();

        $toasts[] = $toast;

        Session::put('toasts', $toasts);
    }
}
