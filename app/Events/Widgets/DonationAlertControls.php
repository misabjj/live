<?php

namespace App\Events\Widgets;

use App\Models\Widget;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DonationAlertControls implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(
        protected Widget $widget,
        protected string $type
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('widgets.'.$this->widget->token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'DonationAlertControls';
    }

    public function broadcastWith(): array
    {
        return [
            'type' => $this->type,
        ];
    }
}
