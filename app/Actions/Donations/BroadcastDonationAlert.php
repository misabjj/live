<?php

namespace App\Actions\Donations;

use App\Events\Widgets\DonationAlert;
use App\Models\Donation;
use Illuminate\Support\Facades\DB;

class BroadcastDonationAlert
{
    /**
     * @throws \Throwable
     */
    public function handle(Donation $donation): void
    {
        if ($donation->in_queue) {
            broadcast(new DonationAlert($donation));

            return;
        }

        DB::transaction(function () use ($donation): void {
            $donation->update(['in_queue' => true]);
            broadcast(new DonationAlert($donation));
        });
    }
}
