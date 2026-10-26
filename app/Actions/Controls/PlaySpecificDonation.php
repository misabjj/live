<?php

namespace App\Actions\Controls;

use App\Events\Widgets\DonationAlert;
use App\Models\Donation;
use App\Models\User;

class PlaySpecificDonation
{
    public function handle(User $user, Donation $donation): void
    {
        abort_unless($donation->streamer_id === $user->id, 403);

        broadcast(new DonationAlert($donation, forcePlay: true));
    }
}
