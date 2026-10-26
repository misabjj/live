<?php

namespace App\Providers;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $serializeDate = static fn (CarbonInterface $date): string => $date->toIso8601String();

        Carbon::serializeUsing($serializeDate);
        CarbonImmutable::serializeUsing($serializeDate);

        URL::forceHttps(
            $this->app->environment(['production', 'staging', 'local'])
        );
    }
}
