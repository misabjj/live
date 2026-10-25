<?php

namespace App\Events\Widgets;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DonationAlertPlayed implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(
        public string $widgetToken,
        public string $donationId
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('widgets.'.$this->widgetToken),
        ];
    }

    public function broadcastAs(): string
    {
        return 'DonationAlertPlayed';
    }

    public function broadcastWith(): array
    {
        return [
            'donation_id' => $this->donationId,
        ];
    }
}
