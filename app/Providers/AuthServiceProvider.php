<?php

namespace App\Providers;

use App\Models\Goal;
use App\Models\PaymentProcessor;
use App\Policies\GoalPolicy;
use App\Policies\PaymentProcessorPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Goal::class => GoalPolicy::class,
        PaymentProcessor::class => PaymentProcessorPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
