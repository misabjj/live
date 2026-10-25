<?php

use App\Models\User;

it('renders every query builder listing with the current variadic API', function () {
    $admin = User::create([
        'display_name' => 'Query Builder Admin',
        'email' => 'query-builder-admin@example.com',
        'handle' => 'query-builder-admin',
        'email_verified_at' => now(),
        'is_admin' => true,
    ]);

    $this->actingAs($admin);

    foreach ([
        'donations.index',
        'goals.index',
        'admin.donations.index',
        'admin.goals.index',
        'admin.narrators.index',
        'admin.users.index',
    ] as $routeName) {
        $this->get(route($routeName))->assertOk();
    }
});
