<?php

namespace App\Actions\Controls;

use App\Events\Widgets\DonationAlertPlayed;
use App\Models\Donation;
use App\Models\User;

class MarkDonationAlertPlayed
{
    public function handle(User $user, Donation $donation): void
    {
        abort_unless($donation->streamer_id === $user->id, 403);

        $widget = $user->widgets()->donationAlert()->firstOrFail();
        $donation->update(['in_queue' => false]);
        broadcast(new DonationAlertPlayed($widget->token, $donation->id));
    }
}
