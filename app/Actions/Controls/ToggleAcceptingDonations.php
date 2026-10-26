<?php

namespace App\Actions\Controls;

use App\Models\User;

class ToggleAcceptingDonations
{
    public function handle(User $user): bool
    {
        if ($user->paymentProcessors()->active()->doesntExist()) {
            return false;
        }

        $user->update(['accepting_donations' => ! $user->accepting_donations]);

        return true;
    }
}
