<?php

namespace App\Actions\Donations;

use App\Models\Donation;

class PlayAlert
{
    public function __construct(private BroadcastDonationAlert $broadcastDonationAlert) {}

    public function handle(Donation $donation): bool
    {
        if ($donation->streamer->queue_paused) {
            if (! $donation->in_queue) {
                $donation->update(['in_queue' => true]);
            }

            return false;
        }

        $this->broadcastDonationAlert->handle($donation);

        return true;
    }
}
