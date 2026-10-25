<?php

use App\Http\Controllers\ControlsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonationAlertConfigurationController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\ProfileQrCodeController;
use App\Http\Controllers\StreamerProfileController;
use App\Http\Controllers\WidgetController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home', [
        'platform_fee_percentage' => config('platform.fee_percentage'),
    ]);
})->name('home');

Route::get('/tax', function () {
    return Inertia::render('tax', [
        'platform_fee_percentage' => config('platform.fee_percentage'),
    ]);
})->name('tax');

Route::get('/@{streamer:handle}', [StreamerProfileController::class, 'show'])->name('donate.show');
Route::get('/donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
Route::post('/{streamer}/donations', [DonationController::class, 'store'])->name('donations.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'show'])->name('dashboard');

    Route::get('controls', [ControlsController::class, 'index'])->name('controls');
    Route::post('controls/toggle-autoplay', [ControlsController::class, 'toggleAutoplay'])->name('controls.toggle-autoplay');
    Route::post('controls/toggle-accepting-donations', [ControlsController::class, 'toggleAcceptingDonations'])->name('controls.toggle-accepting-donations');
    Route::post('controls/skip-donation-alert', [ControlsController::class, 'skipDonationAlert'])->name('controls.skip-donation-alert');
    Route::post('controls/play-donation/{donation}', [ControlsController::class, 'playSpecificDonation'])->name('controls.play-donation');
    Route::post('controls/mark-donation-as-played/{donation}', [ControlsController::class, 'markAsPlayed'])->name('controls.mark-as-played');

    Route::get('donations', [DonationController::class, 'index'])->name('donations.index');
    Route::post('donations/{donation}/play-donation-alert', [DonationController::class, 'playDonationAlert'])->name('donations.play-donation-alert');

    Route::get('goals', [GoalController::class, 'index'])->name('goals.index');
    Route::get('goals/create', [GoalController::class, 'create'])->name('goals.create');
    Route::post('goals', [GoalController::class, 'store'])->name('goals.store');
    Route::get('goals/{goal}/edit', [GoalController::class, 'edit'])->name('goals.edit');
    Route::put('goals/{goal}', [GoalController::class, 'update'])->name('goals.update');
    Route::patch('goals/{goal}/toggle-status', [GoalController::class, 'toggleStatus'])->name('goals.toggle-status');
    Route::delete('goals/{goal}', [GoalController::class, 'destroy'])->name('goals.destroy');

    // Settings routes
    Route::get('settings/profile-qr-code', [ProfileQrCodeController::class, 'index'])->name('settings.profile-qr-code');
    Route::post('settings/profile-qr-code', [ProfileQrCodeController::class, 'store'])->name('settings.profile-qr-code.store');

    Route::get('settings/donation-alert', [DonationAlertConfigurationController::class, 'show'])->name('settings.donation-alert.show');
    Route::put('settings/donation-alert', [DonationAlertConfigurationController::class, 'update'])->name('settings.donation-alert.update');
});

Route::get('/widgets/{widget:token}', [WidgetController::class, 'show'])->name('widgets.show');
Route::post('/widgets/{widget:token}/donation-alert-played/{donation}', [WidgetController::class, 'alertPlayed'])->name('widgets.donation-alert-played');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
