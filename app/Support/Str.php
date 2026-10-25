<?php

namespace App\Support;

class Str extends \Illuminate\Support\Str
{
    public static function containsHttps(string $str): bool
    {
        return str_contains($str, 'https');
    }
}
