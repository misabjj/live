<?php

namespace App\Actions\Controls;

use App\Events\Widgets\DonationAlertControls;
use App\Models\User;

class SkipDonationAlert
{
    public function handle(User $user): void
    {
        DonationAlertControls::dispatch($user->widgets()->donationAlert()->firstOrFail(), 'skip');
    }
}
