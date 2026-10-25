<?php

use Illuminate\Support\Facades\Route;

it('keeps the frontend route contract available to Wayfinder', function () {
    $routeNames = [
        'admin.donations.index',
        'admin.donations.play-donation-alert',
        'admin.goals.index',
        'admin.narrators.index',
        'admin.users.index',
        'controls.mark-as-played',
        'controls.play-donation',
        'controls.skip-donation-alert',
        'controls.toggle-accepting-donations',
        'controls.toggle-autoplay',
        'dashboard',
        'donate.show',
        'donations.index',
        'donations.play-donation-alert',
        'donations.store',
        'goals.create',
        'goals.destroy',
        'goals.edit',
        'goals.index',
        'goals.store',
        'goals.toggle-status',
        'goals.update',
        'login',
        'logout',
        'oauth.redirect',
        'password.confirm',
        'password.email',
        'password.request',
        'password.store',
        'register',
        'settings.background-image.destroy',
        'settings.background-image.store',
        'settings.donation-alert.show',
        'settings.donation-alert.update',
        'settings.donation-rules.show',
        'settings.donation-rules.update',
        'settings.payment-processors.index',
        'settings.payment-processors.store',
        'settings.payment-processors.toggle-status',
        'settings.profile-qr-code',
        'settings.profile-qr-code.store',
        'settings.profile-photo.destroy',
        'settings.profile-photo.store',
        'settings.profile.show',
        'settings.profile.update',
        'settings.widgets.index',
        'settings.widgets.regenerate',
        'settings.widgets.test',
        'verification.send',
        'widgets.donation-alert-played',
    ];

    foreach ($routeNames as $routeName) {
        expect(Route::has($routeName))->toBeTrue("Missing route [{$routeName}].");
    }
});
