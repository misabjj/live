<?php

namespace App\Http\Routing;

use Illuminate\Support\Facades\Route;

class Localized
{
    public static function group(callable $routes): void
    {
        // Default routes (pt) - no prefix
        Route::group([], $routes);

        // Localized routes for other languages
        Route::group([
            'prefix' => '{locale}',
            'where' => ['locale' => 'en|es|pt'],
            'as' => 'localized.',
        ], $routes);
    }
}
