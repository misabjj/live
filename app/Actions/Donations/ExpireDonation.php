<?php

namespace App\Actions\Donations;

use App\Enums\DonationStatus;
use App\Models\Donation;
use RuntimeException;

class ExpireDonation
{
    public function handle(Donation $donation): void
    {
        if ($donation->isNotPending()) {
            throw new RuntimeException('Donation is not pending.');
        }

        $donation->update([
            'status' => DonationStatus::Expired,
            'expired_at' => now(),
        ]);
    }
}
