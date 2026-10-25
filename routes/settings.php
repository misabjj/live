<?php

use App\Http\Controllers\Settings\BackgroundImageController;
use App\Http\Controllers\Settings\DonationRulesController;
use App\Http\Controllers\Settings\PaymentProcessorController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\ProfilePhotoController;
use App\Http\Controllers\WidgetController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('settings')->name('settings.')->group(function () {
    Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('donation-rules', [DonationRulesController::class, 'show'])->name('donation-rules.show');
    Route::put('donation-rules', [DonationRulesController::class, 'update'])->name('donation-rules.update');

    Route::get('payment-processors', [PaymentProcessorController::class, 'show'])->name('payment-processors.index');
    Route::post('payment-processors', [PaymentProcessorController::class, 'store'])->name('payment-processors.store');
    Route::post('payment-processors/{processor}/toggle-status', [PaymentProcessorController::class, 'toggleStatus'])->name('payment-processors.toggle-status');

    Route::get('widgets', [WidgetController::class, 'index'])->name('widgets.index');
    Route::patch('widgets/{widget}/regenerate', [WidgetController::class, 'regenerate'])->name('widgets.regenerate');
    Route::post('widgets/{widget}/test', [WidgetController::class, 'test'])->name('widgets.test');

    Route::post('profile-photo', [ProfilePhotoController::class, 'store'])->name('profile-photo.store');
    Route::delete('profile-photo', [ProfilePhotoController::class, 'destroy'])->name('profile-photo.destroy');

    Route::post('background-image', [BackgroundImageController::class, 'store'])->name('background-image.store');
    Route::delete('background-image', [BackgroundImageController::class, 'destroy'])->name('background-image.destroy');
});
