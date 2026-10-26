<?php

namespace App\Actions\Widgets;

use App\Events\Widgets\DonationAlertPlayed;
use App\Models\Donation;
use App\Models\Widget;

class MarkDonationAlertPlayed
{
    public function handle(Widget $widget, Donation $donation): void
    {
        abort_unless($donation->streamer_id === $widget->user_id, 403);

        $donation->update(['in_queue' => false]);
        broadcast(new DonationAlertPlayed($widget->token, $donation->id));
    }
}
