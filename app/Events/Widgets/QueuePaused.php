<?php

namespace App\Events\Widgets;

use App\Enums\WidgetType;
use App\Models\User;
use App\Models\Widget;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class QueuePaused implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(
        protected User $user,
    ) {}

    public function broadcastOn(): array
    {
        $widget = Widget::where('user_id', $this->user->id)
            ->where('type', WidgetType::DonationAlert)
            ->firstOrFail();

        return [
            new Channel('widgets.'.$widget->token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'donation_alert.queue.paused';
    }

    public function broadcastWith(): array
    {
        return [];
    }
}
