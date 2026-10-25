<?php

namespace App\Events;

use App\Models\Donation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class DonationUpdated implements ShouldBroadcast
{
    use Dispatchable;

    public function __construct(
        protected Donation $donation
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('donations.'.$this->donation->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'DonationUpdated';
    }
}
