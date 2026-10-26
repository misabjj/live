<?php

namespace App\Actions\Donations;

use App\Enums\DonationStatus;
use App\Events\DonationUpdated;
use App\Events\Widgets\GoalUpdated;
use App\Models\Donation;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApproveDonation
{
    public function __construct(
        private readonly BroadcastDonationAlert $broadcastDonationAlert,
    ) {}

    /**
     * @throws \Throwable
     */
    public function handle(Donation $donation): void
    {
        if ($donation->isNotPending()) {
            throw new RuntimeException('Donation is not pending.');
        }

        DB::transaction(function () use ($donation): void {
            $donation->update([
                'in_queue' => true,
                'status' => DonationStatus::Approved,
                'approved_at' => now(),
            ]);

            broadcast(new DonationUpdated($donation));

            if ($donation->goal_id) {
                $donation->goal()->increment('raised_amount', $donation->amount);
                if ($donation->goal) {
                    broadcast(new GoalUpdated($donation->goal));
                }
            }

            if (! $donation->streamer->queue_paused) {
                $this->broadcastDonationAlert->handle($donation);
            }
        });
    }
}
