<?php

namespace App\Actions\Donations;

use App\Models\Donation;

class BlockDonor
{
    public function handle(Donation $donation): void
    {
        $donation->delete();
    }
}
