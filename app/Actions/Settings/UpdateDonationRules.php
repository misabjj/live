<?php

namespace App\Actions\Settings;

use App\Models\User;

class UpdateDonationRules
{
    /** @param array<string, mixed> $data */
    public function handle(User $user, array $data): void
    {
        $user->donationRules()->updateOrCreate(['user_id' => $user->id], $data);
    }
}
