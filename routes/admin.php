<?php

use App\Http\Controllers\Admin\DonationController;
use App\Http\Controllers\Admin\GoalController;
use App\Http\Controllers\Admin\NarratorController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('donations', [DonationController::class, 'index'])->name('donations.index');
    Route::post('donations/{donation}/play-donation-alert', [DonationController::class, 'playDonationAlert'])
        ->name('donations.play-donation-alert');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('goals', [GoalController::class, 'index'])->name('goals.index');
    Route::get('narrators', [NarratorController::class, 'index'])->name('narrators.index');
});
