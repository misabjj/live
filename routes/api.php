<?php

use App\Http\Controllers\Webhooks\PaymentProcessorWebhookController;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

Route::prefix('/webhook')
    ->name('webhook.')
    ->withoutMiddleware(PreventRequestForgery::class)
    ->group(function () {
        Route::post('payment-processors/{processor}', [PaymentProcessorWebhookController::class, 'efiBank'])->name('payment-processors');
    });
